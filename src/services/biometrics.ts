/**
 * Biometric Authentication Service (WebAuthn / FaceID / Fingerprint / Windows Hello)
 * Secures sensitive journal entries and metacognitive reflection telemetry.
 */

// Helper: Convert ArrayBuffer to Base64url
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Helper: Convert Base64url to Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  let normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (normalized.length % 4) {
    normalized += '=';
  }
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface BiometricCapabilities {
  isSupported: boolean;
  hasPlatformAuthenticator: boolean;
  platformType: 'apple' | 'android' | 'windows' | 'generic';
  platformLabel: string;
}

class BiometricService {
  private _isUnlocked: boolean = false;
  private _lastUnlockedAt: number = 0;

  /**
   * Detect device platform and whether WebAuthn platform biometrics are supported
   */
  async checkCapabilities(): Promise<BiometricCapabilities> {
    const isSupported = typeof window !== 'undefined' && !!window.PublicKeyCredential && !!navigator.credentials;
    
    let hasPlatformAuthenticator = false;
    if (isSupported && typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      try {
        hasPlatformAuthenticator = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      } catch {
        hasPlatformAuthenticator = false;
      }
    }

    const ua = navigator.userAgent.toLowerCase();
    let platformType: BiometricCapabilities['platformType'] = 'generic';
    let platformLabel = 'Platform Biometrics (Fingerprint / Face)';

    if (/iphone|ipad|ipod|macintosh/.test(ua)) {
      platformType = 'apple';
      platformLabel = 'Face ID / Touch ID';
    } else if (/android/.test(ua)) {
      platformType = 'android';
      platformLabel = 'Android Biometrics / Fingerprint';
    } else if (/windows/.test(ua)) {
      platformType = 'windows';
      platformLabel = 'Windows Hello (Face / Fingerprint)';
    }

    return {
      isSupported,
      hasPlatformAuthenticator,
      platformType,
      platformLabel,
    };
  }

  /**
   * Register a new biometric passkey credential on this device
   */
  async registerCredential(email: string, displayName: string): Promise<{
    success: boolean;
    credentialId?: string;
    deviceName?: string;
    error?: string;
  }> {
    const caps = await this.checkCapabilities();

    if (!caps.isSupported) {
      return {
        success: false,
        error: 'WebAuthn biometric authentication is not supported by this browser environment.',
      };
    }

    try {
      const challenge = window.crypto.getRandomValues(new Uint8Array(32));
      const userId = new TextEncoder().encode(email || 'practitioner_' + Date.now());

      const createOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: 'quadraminds.ai',
          },
          user: {
            id: userId,
            name: email || 'practitioner@quadra.sight',
            displayName: displayName || 'Practitioner',
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },   // ES256 (standard for mobile/face biometrics)
            { alg: -257, type: 'public-key' }, // RS256 (fallback)
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform', // Hardware device biometric (FaceID, TouchID, Android biometric)
            userVerification: 'required',
            residentKey: 'preferred',
          },
          timeout: 60000,
          attestation: 'none',
        },
      };

      const credential = (await navigator.credentials.create(createOptions)) as PublicKeyCredential | null;

      if (!credential) {
        return {
          success: false,
          error: 'No biometric credential was returned from device authenticator.',
        };
      }

      const credentialId = bufferToBase64(credential.rawId);
      const deviceName = `${caps.platformLabel} (${new Date().toLocaleDateString()})`;

      return {
        success: true,
        credentialId,
        deviceName,
      };
    } catch (err: any) {
      console.warn('Biometric registration error:', err);
      // Specific error classification
      if (err.name === 'NotAllowedError') {
        return {
          success: false,
          error: 'Biometric verification was cancelled or timed out. Please try again.',
        };
      }
      if (err.name === 'NotSupportedError') {
        return {
          success: false,
          error: 'Platform authenticator (FaceID / Fingerprint) is not supported on this specific device configuration.',
        };
      }
      return {
        success: false,
        error: err.message || 'Failed to register biometric credential on this device.',
      };
    }
  }

  /**
   * Verify identity using device FaceID, TouchID, or Fingerprint
   */
  async verifyBiometrics(credentialId?: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const caps = await this.checkCapabilities();

    if (!caps.isSupported) {
      return {
        success: false,
        error: 'Biometric authentication is not supported in this browser.',
      };
    }

    try {
      const challenge = window.crypto.getRandomValues(new Uint8Array(32));

      const getOptions: CredentialRequestOptions = {
        publicKey: {
          challenge,
          allowCredentials: credentialId
            ? [
                {
                  id: base64ToBuffer(credentialId),
                  type: 'public-key',
                  transports: ['internal'],
                },
              ]
            : undefined,
          userVerification: 'required',
          timeout: 60000,
        },
      };

      const assertion = (await navigator.credentials.get(getOptions)) as PublicKeyCredential | null;

      if (assertion) {
        this._isUnlocked = true;
        this._lastUnlockedAt = Date.now();
        return { success: true };
      }

      return {
        success: false,
        error: 'Biometric signature could not be verified.',
      };
    } catch (err: any) {
      console.warn('Biometric verification error:', err);
      if (err.name === 'NotAllowedError') {
        return {
          success: false,
          error: 'Authentication cancelled or biometric unrecognized.',
        };
      }
      return {
        success: false,
        error: err.message || 'Biometric verification failed.',
      };
    }
  }

  /**
   * Check if the Journal is currently unlocked
   */
  isJournalUnlocked(autoLockMinutes: number = 15): boolean {
    if (!this._isUnlocked) return false;
    if (autoLockMinutes <= 0) return true; // 0 = session only / never auto-timeout

    const elapsedMinutes = (Date.now() - this._lastUnlockedAt) / (1000 * 60);
    if (elapsedMinutes > autoLockMinutes) {
      this._isUnlocked = false;
      return false;
    }
    return true;
  }

  /**
   * Lock the journal immediately
   */
  lockJournal(): void {
    this._isUnlocked = false;
    this._lastUnlockedAt = 0;
  }

  /**
   * Unlock the journal (after biometrics or PIN verification)
   */
  unlockJournal(): void {
    this._isUnlocked = true;
    this._lastUnlockedAt = Date.now();
  }
}

export const biometricService = new BiometricService();
