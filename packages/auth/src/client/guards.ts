import { getSession } from "./session";

const resolveAuthOrigin = () => {
  const nextVal = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_AUTH_ORIGIN : undefined;
  if (nextVal) return nextVal;
  try {
    const viteVal = typeof import.meta !== "undefined" ? (import.meta as any)?.env?.VITE_AUTH_ORIGIN : undefined;
    if (viteVal) return viteVal;
  } catch {
  }
  return "https://auth.wraithorg.com";
};

export function buildAuthLoginUrl(returnTo?: string) {
  const authOrigin = resolveAuthOrigin().replace(/\/+$/, "");
  const finalReturnTo = returnTo || window.location.href;
  return `${authOrigin}/login?return_to=${encodeURIComponent(finalReturnTo)}`;
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    window.location.href = buildAuthLoginUrl();
  }

  return session;
}