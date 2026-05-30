import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get("authorization");

  const backendSyncUrl = process.env.BACKEND_SYNC_URL || "http://localhost:5000/api/auth/sync";
  const response = await fetch(backendSyncUrl, {
    method: "POST",
    headers: {
      Authorization: token || "",
    },
  });

  return new Response(await response.text(), {
    status: response.status,
  });
};