import React, { createContext, ElementType, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";
import Login from "../pages/login";

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
	const [authError, setAuthError] = useState("");

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
		// @ts-ignore
		setUser(JSON.parse(localStorage.getItem("user")));

		setLoading(false);
	}, []);

	const login = async () => {
		const { data } = await axios.post("/api/auth/login");
		router.replace(data.redirect);
	};

	const getToken = async (code: string) => {
		setLoading(true);

		const params = new URLSearchParams({
			code,
		});

		axios
			.get("/api/auth/callback?" + params)
			.then(async ({ data }) => {
				const resp = await axios.get("https://api.spotify.com/v1/me", {
					headers: {
						Authorization: "Bearer " + data.access_token,
						"Content-Type": "application/json",
					},
				});

				const user = resp.data;

				window.localStorage.setItem("access_token", data.access_token);
				window.localStorage.setItem("refresh_token", data.refresh_token);
				window.localStorage.setItem("expires", moment().add(data.expires_in, "seconds").toString());
				window.localStorage.setItem("user", JSON.stringify(user));

				setAccessToken(localStorage.getItem("access_token"));
				setExpires(localStorage.getItem("expires"));
				setRefreshToken(localStorage.getItem("refresh_token"));
				// @ts-ignore
				setUser(JSON.parse(localStorage.getItem("user")));

				router.push("/");
				setLoading(false);
			})
			.catch((error) => {
				setAuthError(error.response.data);
				setLoading(false);
			});
	};

	const logout = async () => {
		setLoading(true);

		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("expires");
		localStorage.removeItem("user");

		setUser(null);
		setAccessToken(null);
		setExpires(null);
		setRefreshToken(null);

		router.reload();
		router.replace("/");

		setLoading(false);
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

	if (loading) {
		return <>Loading...</>;
	}

	if (!loading && !user) {
		return (
			<AuthContext.Provider value={value}>
				<Login authError={authError} />
			</AuthContext.Provider>
		);
	} 

	if (!loading && user) {
		return (
			<AuthContext.Provider value={value}>
				<>{children}</>
			</AuthContext.Provider>
		);
	}

	return null;
}
