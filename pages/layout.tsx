import Head from "next/head";
import styles from "../styles/Home.module.scss";

interface Props {
	title: string;
	children: React.ReactNode;
}

const Layout = (props: Props) => {
	return (
		<div className={styles.container}>
			<Head>
				<title>{props.title}</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>{props.children}</main>

			<footer className={styles.footer}></footer>
		</div>
	);
};

export default Layout;