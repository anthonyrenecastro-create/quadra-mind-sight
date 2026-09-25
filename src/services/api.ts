// Thin wrapper around fetch for same-origin API calls.
// Kept as a single choke point in case auth headers are ever needed again,
// without touching every view.
export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  return fetch(input, init);
}
