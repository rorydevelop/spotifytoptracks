import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";

const AuthContext = createContext<any>({});

export function useAuth() {
	return useContext(AuthContext);
}

interface Props {
	children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
	const router = useRouter();

	const [loading, setLoading] = useState(true);

	const [accessToken, setAccessToken] = useState<string | null>();
	const [refreshToken, setRefreshToken] = useState<string | null>();
	const [expires, setExpires] = useState<string | null>();
	const [user, setUser] = useState<any>();

	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get("code");
		if (code) {
			getToken(code).then((res) => {
				setLoading(false);
			});
		}

		setAccessToken(localStorage.getItem("access_token"));
		setExpires(localStorage.getItem("expires"));
		setRefreshToken(localStorage.getItem("refresh_token"));

		setLoading(false);
	}, []);

	const login = async () => {
		const { data } = await axios.post("/api/login");
		router.replace(data.redirect);
	};

	const getToken = async (code: string) => {
		setLoading(true);

		const params = new URLSearchParams({
			code,
		});

		try {
			const { data } = await axios.get("/api/auth/callback/spotify?" + params);

			window.localStorage.setItem("access_token", data.access_token);
			window.localStorage.setItem("refresh_token", data.access_token);
			window.localStorage.setItem("expires", moment().add(data.expires_in, "seconds").toString());

			setLoading(false);

			router.replace("/");
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	// logout
	const logout = async () => {
		localStorage.removeItem("auth");
		setUser(null);
		// const res = await HttpClient.get("/logout");
	};

	const value = {
		user,
		accessToken,
		expires,
		refreshToken,
		loading,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			<>
				{loading && <>Loading...</>}
				{!loading && children}
			</>
		</AuthContext.Provider>
	);
}
