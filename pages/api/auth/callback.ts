import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const code: string = req.query.code as string;
	const state: string = req.query.state as string;

	if (code === undefined) {
		res.send("Error");
	} else {
		const headers = {
			Authorization: "Basic " + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"),
			"Content-Type": "application/x-www-form-urlencoded",
		};

		const params = new URLSearchParams({
			code,
			redirect_uri: process.env.SPOTIFY_AUTH_CALLBACK as string,
			grant_type: "authorization_code",
		});

		axios
			.post("https://accounts.spotify.com/api/token", params, { headers })
			.then(({ data }) => {
				res.json(data);
			})
			.catch((error) => {
				console.log(error.response.data?.error_description);
			});
	}
}
