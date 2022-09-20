import { NextApiRequest, NextApiResponse } from "next";

interface Data {}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	var state = "dasdasdkkclasmdksl";
	var scope = "user-read-private user-read-email user-top-read";

	const params = new URLSearchParams({
		response_type: "code",
		client_id: process.env.SPOTIFY_CLIENT_ID as string,
		scope,
		redirect_uri: process.env.SPOTIFY_AUTH_CALLBACK as string,
		state,
	});

	const redirect = "https://accounts.spotify.com/authorize?" + params;

	res.json({ redirect: redirect });
}
