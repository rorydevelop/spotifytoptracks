import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "./layout";
import moment from "moment";
import { useAuth } from "../context/AuthContext";

export default function login() {
	const router = useRouter();
	const { login } = useAuth();

	return (
		<Layout title="Login">
			<div className="container">
				<h1>Login</h1>
				<button
					onClick={() => {
						login();
					}}
				>
					login with spotify
				</button>
			</div>
		</Layout>
	);
}
