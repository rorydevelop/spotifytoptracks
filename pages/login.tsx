import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "./layout";
import { useAuth } from "../context/AuthContext";

import styles from "../styles/modules/Login.module.scss";

export default function Login() {
	const { logout, user, login } = useAuth();

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
						<button
							onClick={(e) => {
								e.preventDefault();
								login();
							}}
						>
							login with spotify
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
}
