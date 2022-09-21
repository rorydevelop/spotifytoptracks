import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const __mock__top = require("../__mocks__/top.json");

export default function useEndpoints() {
	const spotifyBaseUrl = "https://api.spotify.com/v1";

	const auth = useAuth();

	const debug = process.env.NODE_ENV === 'development';

	const request = axios.create({
		headers: {
			Authorization: "Bearer " + auth.accessToken,
		},
	});

	const getTopTracks = async (limit = "12") => {
		if (debug) {
			return await __mock__top;
		}
		const params = new URLSearchParams({
			limit,
		});

		const result = await request.get(spotifyBaseUrl + "/me/top/" + "tracks?" + params);

		return result.data;
	};

	return {
		getTopTracks,
	};
}
