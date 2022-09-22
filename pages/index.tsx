import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useEndpoints from "../hooks/useEndpoints";
import Layout from "./layout";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

import styles from "../styles/modules/Home.module.scss";
import { Preview, SpotifyTrack } from "../types/types";

const Home: NextPage = (props) => {
	/**
	 * Hooks
	 */
	const { user, logout } = useAuth();
	const { getTopTracks } = useEndpoints();
	const [topTracks, setTopTracks] = useState<{ items: SpotifyTrack[] } | null>();
	const [previews, setPreviews] = useState<Array<Preview>>([]);
	const [tracksIndex, setTracksIndex] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);

	/**
	 * On first load fetch the tracks and previews
	 *
	 */
	useEffect(() => {
		loadTracks();
	}, []);

	/**
	 * Update the tracks index state
	 * @param index
	 */
	const onTracksIndexUpdate = (index: number): void => {
		setTracksIndex(index);
	};

	/**
	 * Load the tracks
	 *
	 * @async
	 */
	const loadTracks = async () => {
		try {
			const tracks = await getTopTracks();
			
			const urls: Array<Preview> = [];
	
			if (tracks) {
				tracks.items.map((track: SpotifyTrack, index: number) => {
					urls[index] = {
						url: track.preview_url,
						title: track.name,
						artists: track.album.artists,
					};
				});
			}
	
			setTopTracks(tracks);
			setPreviews(urls);
	
			setLoading(false);
		} catch (error) {
			logout();
		}
	};

	/**
	 * If loading return loading view
	 */
	if (loading) {
		return (
			<>
				<Layout title="Loading - Spotify Top Tracks">
					<div className={styles.loading}>loading...</div>
				</Layout>
			</>
		);
	}

	/**
	 * Render
	 *
	 */
	return (
		<Layout title="Home - Spotify Top Tracks">
			<>
				<AudioPlayer tracks={previews} onTracksIndexUpdate={onTracksIndexUpdate} tracksIndex={tracksIndex} />

				<div className="container">
					<div className={styles.wrapper}>
						<p>
							Hey <b>{user.display_name}</b> ,
						</p>

						{!topTracks && <p>Sorry, It looks like there is no information on your top tracks yet. Keep listening and try back again later.</p>}

						{topTracks && (
							<>
								<p>Here are your {topTracks.items.length} top tracks. Click on a track to play !</p>

								<div>
									<ul className={styles.track_list}>
										{topTracks.items.map((t: SpotifyTrack, index: number) => {
											return (
												<li key={t.id} className={styles.track_item}>
													<div className={styles.track_item_image_wrapper}>
														<img
															onClick={(e) => {
																e.preventDefault();
																setTracksIndex(index);
															}}
															className={tracksIndex === index ? styles.track_tile_thumb_active : styles.track_tile_thumb}
															src={t.album.images[0].url}
															alt=""
														/>
													</div>
													<div className={styles.track_item_pos}>{index + 1}</div>
													<div className={styles.track_item_meta}>
														<p>
															{t.name}{" "}
															<a target="_blank" rel="noreferrer" href={t.external_urls.spotify}>
																<i className="bi bi-box-arrow-up-right"></i>
															</a>
														</p>
														<p>{t.album.artists[0].name}</p>
													</div>
												</li>
											);
										})}
									</ul>
								</div>
							</>
						)}
					</div>
				</div>
			</>
		</Layout>
	);
};

export default Home;
