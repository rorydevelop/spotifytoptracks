import { React, useState } from "react";

import styles from "../../styles/modules/VolumePlayer.module.scss";

/**
 * Volume control component
 *
 * @param {{defaultValue, handleVolumeChange}} param0
 * @description controls the UI for the volume control
 */
const VolumeControl = ({ defaultValue = 0.2, handleVolumeChange }) => {
	/**
	 * Relative values to support the HTML audio element
	 *
	 */
	const values = [0.2, 0.4, 0.6, 0.8, 1];

	/**
	 *
	 *
	 */
	const [volume, setVolume] = useState(defaultValue);

	/**
	 * Check if a bar is active
	 *
	 * @param {*} v
	 * @returns
	 */
	const isActive = (v) => {
		if (v <= volume) return true;
	};

	/**
	 * Handle clicks
	 * @param {*} e
	 */
	const handleClick = (e) => {
		e.preventDefault();
		setTimeout(() => {
			const value = e.target.dataset.value;

			handleVolumeChange(value);
			setVolume(value);

			// makes the ui interaction feel smoother
		}, 100);
	};

	/**
	 * Controls markup
	 *
	 */
	const controls = values.map((val, index) => (
		<button
			key={index}
			onClick={(e) => {
				handleClick(e);
			}}
			data-value={val}
			className={isActive(val) ? styles.volume_block_active : styles.volume_block}
		></button>
	));

	/**
	 * Render
	 *
	 */
	return (
		<div className={styles.wrapper}>
            <span className={styles.icon}>
			    <i className="bi bi-volume-up-fill"></i>
            </span>
			<span className={styles.blocks}>{controls}</span>
		</div>
	);
};

export default VolumeControl;
