# Supabase Email Confirmation

The app sends signup and resend requests through Supabase Auth. Email delivery is handled by the Supabase project, so deployment requires the following settings in the Supabase dashboard.

1. In **Authentication > Providers > Email**, enable **Confirm email**.
2. In **Authentication > URL Configuration**, set the production **Site URL** and add the exact value of `VITE_AUTH_REDIRECT_URL` to **Redirect URLs**. For local development, add `http://localhost:5173/**`.
3. Configure a production SMTP provider under **Authentication > SMTP Settings**. Supabase's default email service is intended for testing and is rate-limited.
4. Verify the confirmation email template uses `{{ .ConfirmationURL }}` and check the provider logs and spam folder when testing.

If `VITE_AUTH_REDIRECT_URL` is omitted, the app uses the browser's current origin. The URL still must be present in Supabase's Redirect URLs allowlist.