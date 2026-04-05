/**
 * Public API base URL. Override with NEXT_PUBLIC_API_URL in .env for local backends.
 */
export function getApiBase(): string {
  const fromEnv =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.trim()
      : "";
      return fromEnv ;
}
