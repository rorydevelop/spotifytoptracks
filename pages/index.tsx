import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useEndpoints, { SpotifyTrack, SpotifyUser } from "../hooks/useEndpoints";
import Layout from "./layout";

import styles from "../styles/Home.module.scss";

const Home: NextPage = (props) => {
	const { getUser, getTopTracks, getPreviews } = useEndpoints();

	const [user, setUser] = useState<SpotifyUser>(getUser());
	const [topTracks, setTopTracks] = useState(getTopTracks());
	const [previews, setPreviews] = useState(getPreviews());

	useEffect(() => {
		console.log(user, topTracks, previews);

		return () => {};
	}, []);

	const topTracksMap = topTracks.items.map((t: SpotifyTrack) => {
		return (
			<>
				<div className={styles.track_item}>
					<img src={t.album.images[0].url} alt="" />
					<p>{t.name}</p>
					<p>{t.album.artists[0].name}</p>
				</div>
			</>
		);
	});

	return (
		<Layout title="Home - Spotify Top Tracks">
			<>
				<div className="container">
					<div className={styles.wrapper}>
						<div className={styles.profile_image_wrapper}>
							<img className={styles.profile_image} src={user.images[0].url} alt={user.display_name + "profile"} />
						</div>

						<p className="text-center">
							Hey <b>{user.display_name} </b>
						</p>

						<p className="text-center">Welcome ! we are currently showing {topTracks.items.length} top tracks for you.</p>

						<div>
							<ul className={styles.track_list}>{topTracksMap}</ul>
						</div>
					</div>
				</div>
			</>
		</Layout>
	);
};

export default Home;
