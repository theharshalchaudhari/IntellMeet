import { getSession } from "./session";

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    const redirect =
      window.location.pathname + window.location.search;

    window.location.href =
      `http://localhost:3000/login?redirect=${encodeURIComponent(redirect)}`;
  }

  return session;
}