import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "./layout";
import { useAuth } from "../context/AuthContext";

import styles from "../styles/modules/Login.module.scss";

interface Props {
	authError: string;
}

export default function Login(props: Props) {
	const { logout, user, login } = useAuth();

	const authErrorMarkup = () => {
		const iframeStyles = {
			display: "flex",
			justifyContent: "center",
		};

		return (
			<div>
				<p className={styles.auth_error}>User is not registered in the spotify dashboard or does not have permission to access this page. Please use the contact form to request demo account access.</p>
				<div style={iframeStyles}>
					<iframe src="https://docs.google.com/forms/d/e/1FAIpQLScuVTssZbNLYkgNjzHZq0dqin9DA36SmPcbvVlmSG181FWWOQ/viewform?embedded=true" width="640" height="780">
						Loading…
					</iframe>
				</div>
			</div>
		);
	};

	if (user) {
		return (
			<Layout title="Login">
				<div className="container">
					<div className={styles.wrapper}>
						<div>
							<h1>Already Logged in, sign out ?</h1>
							<button
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout title="Login">
			<div className="container">
				<div className={styles.wrapper}>
					<div>
						<h1>Login</h1>

						<div className={styles.login_button_wrapper}>
							<button
								onClick={(e) => {
									e.preventDefault();
									login();
								}}
							>
								login with spotify
							</button>
						</div>

						{/* Auth Error */}
						{props.authError && authErrorMarkup()}
					</div>
				</div>
			</div>
		</Layout>
	);
}
