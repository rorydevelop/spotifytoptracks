import React, { useEffect, useState } from "react";
import { useRef } from "react";
import VolumeControl from "../VolumeControl/VolumeControl";

import styles from "../../styles/modules/AudioPlayer.module.scss";
import _ from "lodash";

/**
 * Audio Player
 *
 * @param {{tracks, tracksIndex, onTracksIndexUpdate}}
 * @description custom audio player component
 */
const AudioPlayer = ({ tracks, tracksIndex, onTracksIndexUpdate }) => {
	const audioRef = useRef();

	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [volume, setVolume] = useState(0.2);
	const [currentIndex, setCurrentIndex] = useState();
	const [title, setTitle] = useState("");
	const [artist, setArtist] = useState("");

	/**
	 * Use effect
	 *
	 * @description triggered when the component loads / when a track is clicked
	 */
	useEffect(() => {
		if (tracksIndex !== null) {
			// when you select a track to play - handle
			setAudioSource(tracks[tracksIndex]);
			setCurrentIndex(tracksIndex);
			onTracksIndexUpdate(tracksIndex);

			onPlay();
		}

		if(tracksIndex === null) {
			setAudioSource(tracks[0]);
			setCurrentIndex(0);
		}

		return () => {};
	}, [tracksIndex]);

	/**
	 * On play
	 *
	 * @returns void
	 */
	const onPlay = () => {
		setIsPlaying(true);
		audioRef.current.volume = volume;
		audioRef.current.play();
	};

	/**
	 * On pause
	 *
	 * @returns void
	 */
	const onPause = () => {
		setIsPlaying(false);
		audioRef.current.pause();
	};

	/**
	 * On time update
	 *
	 * @param {*} e
	 * @returns void
	 */
	const onTimeUpdate = (e) => {
		let duration = e.target.duration;
		let elapsed = e.target.currentTime;

		setProgress((elapsed / duration) * 100);
	};

	/**
	 * On volume change
	 *
	 * @param {*} changedValue
	 * @returns void
	 */
	const onVolumeChange = (changedValue) => {
		audioRef.current.volume = changedValue;
		setVolume(changedValue);
	};

	/**
	 * On Ended
	 *
	 * @description fires when the audio track is finished playing
	 * @returns void
	 */
	const onEnded = () => {
		onPause();
		loadNextTrack();
	};

	/**
	 * Load next track
	 *
	 * @description attempt to load the next track
	 */
	const loadNextTrack = () => {
		const tracksLength = tracks.length - 1;

		// load the next track
		if (currentIndex < tracksLength) {
			// property is readonly
			let current = currentIndex;
			let nextIndex = parseInt(current) + 1;

			setCurrentIndex(nextIndex);
			onTracksIndexUpdate(nextIndex);

			setAudioSource(tracks[nextIndex]);

			setTimeout(() => {
				onPlay();
			}, 100);
		} else {
			setCurrentIndex(0);
			onTracksIndexUpdate(0);

			setAudioSource(tracks[0]);

			setTimeout(() => {
				onPlay();
			}, 100);
		}
	};

	/**
	 * Set audio source
	 *
	 * @param {object} source
	 * @returns void
	 */
	const setAudioSource = (source) => {
		if (source) {
			audioRef.current.src = source.url;
			setTitle(source.title);
			setArtist(source.artists[0]);
		}
	};

	/**
	 * Markup - play/pause
	 *
	 */
	const markupPlayPause = () => {
		return (
			<>
				{!isPlaying && (
					<button
						className={styles.play_pause}
						onClick={() => {
							onPlay();
						}}
					>
						<i className="bi bi-play-fill"></i>
					</button>
				)}

				{isPlaying && (
					<button
						className={styles.play_pause}
						onClick={() => {
							onPause();
						}}
					>
						<i className="bi bi-pause-fill"></i>
					</button>
				)}
			</>
		);
	};

	/**
	 * Markup - meta
	 *
	 */
	const markupMeta = () => {
		return (
			<>
				<div className={styles.meta}>
					<p>{title}</p>
					<p>{artist.name}</p>
				</div>
			</>
		);
	};

	/**
	 * Markup - progress
	 */
	const markupProgress = () => {
		return (
			<>
				<div className={styles.progress}>
					<div className={styles.progress_elapsed} style={{ width: `${progress}%` }}></div>
				</div>
			</>
		);
	};

	/**
	 * Render
	 *
	 */
	return (
		<div className={styles.player_wrapper}>
			<audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={onEnded} className="invisible"></audio>
			<div>
				{/* Progress */}
				{markupProgress()}

				<div className={styles.player_inner}>
					<div className={styles.player_left}>
						{/* Meta */}
						{markupMeta()}
					</div>

					<div className={styles.player_right}>
						{/* Play / Pause */}

						<VolumeControl defaultValue={volume} handleVolumeChange={onVolumeChange} />
					</div>
				</div>

				<div className={styles.player_footer}>{markupPlayPause()}</div>
			</div>
		</div>
	);
};

export default AudioPlayer;
