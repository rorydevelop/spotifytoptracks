export interface Preview {
	url: string;
	title: string;
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
}

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
