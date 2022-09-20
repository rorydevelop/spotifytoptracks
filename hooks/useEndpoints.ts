import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const __mock__me = require("../__mocks__/me.json");
const __mock__top = require("../__mocks__/top.json");

export interface SpotifyTrack {
	album: {
		album_type: string;
		artists: Array<{
			external_urls: {
				spotify: string;
			};
			href: string;
			id: string;
			name: string;
			type: string;
			uri: string;
		}>;
		available_markets: string[];
		images: Array<{ height: number; url: string; width: number }>;
	};
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
		isrc: string;
	};
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}

export interface SpotifyUser {
	country: string;
	display_name: string;
	email: string;
	explicit_content: {
		filter_enabled: boolean;
		filter_locked: boolean;
	};
	external_urls: {
		spotify: string;
	};
	followers: {
		href: string | null;
		total: number;
	};
	href: string;
	id: number;
	images: [
		{
			height: number | null;
			url: string;
			width: number | null;
		}
	];
	product: string;
	type: string;
	uri: string;
}

export default function useEndpoints() {
	const spotifyBaseUrl = "https://api.spotify.com/v1";

	const auth = useAuth();

	const debug = true;

	const request = axios.create({
		headers: {
			Authorization: "Bearer " + auth.accessToken,
		},
	});

	const getUser: () => SpotifyUser = () => {
		if (debug) {
			return __mock__me;
		}

		request
			.get(spotifyBaseUrl + "/me")
			.then(({ data }) => {
				console.log(data);

				return data;
			})
			.catch((error) => console.log(error));
	};

	const getTopTracks: () => { items: Array<SpotifyTrack> } = (type: "tracks" | "artists" = "tracks", timeRange = 10, limit = 10, offset = 0) => {
		if (debug) {
			return __mock__top;
		}

		request
			.get(spotifyBaseUrl + "/me/top/" + type)
			.then(({ data }) => {
				console.log(data);

				return data;
			})
			.catch((error) => console.log(error));
	};

	const getPreviews = () => {
		const topTracks = getTopTracks();
		const urls: string[] = [];

		topTracks.items.map((track: SpotifyTrack) => {
			urls.push(track.preview_url);
		});

		return urls;
	};

	return {
		getUser,
		getTopTracks,
		getPreviews,
	};
}
