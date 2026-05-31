import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
	const token = request.headers.get("authorization");

	const response = await fetch("http://localhost:5000/api/user/me", {
		headers: {
			Authorization: token || "",
		},
	});

	return new Response(await response.text(), {
		status: response.status,
	});
};