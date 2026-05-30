import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = ({ url, request }) => {
  const origin = url.origin;
  const returnTo = url.searchParams.get("return_to") || `${origin}/dashboard`;
  const callbackUrl = new URL("/auth/callback", origin);

  callbackUrl.searchParams.set("return_to", returnTo);

  const backendAuthUrl = process.env.BACKEND_AUTH_URL || "http://localhost:5000/api/auth/google";
  const redirectUrl = new URL(backendAuthUrl);

  redirectUrl.searchParams.set("redirectTo", callbackUrl.toString());

  return Response.redirect(redirectUrl.toString());
};