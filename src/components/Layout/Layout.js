import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { login, logout } from "../../slicers/loginSlice";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import Register from "../Register";
import Filters from "../Filters";
import Excursions from "../Excursions";
import UserPage from "../UserPage";
import Footer from "../Footer";
import "bootstrap/dist/css/bootstrap.css";
import styles from "../../css/Layout.module.css";

//This is the layout, here goes the web structure.
export const Layout = ({ children }) => {
	// Variable we need to be able to use dispatchers
	const loginDispatch = useDispatch();

	// Array of excursions that are needed in that moment which are the list of all the excursions and the search (for both the search bar and the filters)
	const [excursionArray, setExcursionArray] = useState([]);

	// This useEffect controls the token in the sessionStorage. The token is saved in the sessionStorage for the user to be able to stay logged in
	useEffect(() => {
		// This function saves the current token and logs the user again in case that the webpage is refreshed. With this the user won´t lose his session
		const loadToken = () => {
			// Gets the token from sessionStorage
			const sessionToken = sessionStorage["token"];

			// Variable that has the url that is needed for the fetch
			const url = `http://localhost:3001/token/${sessionToken}`;

			// Variable that saves the options that the fetch needs
			const options = {
				method: "GET",
				mode: "cors",
				headers: { "Content-Type": "application/json" },
			};

			// If there´s a token and that token is not an empty string
			if (sessionToken) {
				fetch(url, options)
					.then((response) => {
						// If it´s the correct token and the correct user...
						if (response.status === 404) {
							throw new Error();
						}
						return response.json();
					})
					.then(function (data) {
						// ...the user gets logged in again
						loginDispatch(
							login({
								user: data.user,
								token: data.token,
							})
						);
					})
					.catch(function (error) {
						console.log(error);
						loginDispatch(logout());
						delete sessionStorage["token"];
					});
			}
		};

		loadToken();
	}, [loginDispatch]);

	return (
		<Container className={styles.container} fluid>
			<NavigationBar setExcursions={setExcursionArray} />
			<Row>
				<Col>
					<main>{children}</main>
				</Col>
			</Row>
			<Row>
				<Routes>
					<Route
						path="/"
						element={
							<>
								<Filters />
								<Excursions excursionData={excursionArray} />
							</>
						}
					/>
					<Route path="register" element={<Register />} />
					<Route path="userPage" element={<UserPage />} />
				</Routes>
			</Row>
			<Row>
				<Footer />
			</Row>
		</Container>
	);
};

export default Layout;
