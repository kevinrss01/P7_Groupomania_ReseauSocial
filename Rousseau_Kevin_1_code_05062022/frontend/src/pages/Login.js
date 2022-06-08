import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Login() {
	const [username, setUsername] = useState(''); //HOLD THE VALUE FOR THE INPUT
	const [password, setPassword] = useState(''); //HOLD THE VALUE FOR THE INPUT
	const [errorMessage, setErrorMessage] = useState('');
	const { setAuthState } = useContext(AuthContext);

	let navigate = useNavigate();

	const login = () => {
		const data = { username: username, password: password };
		axios.post('http://localhost:3002/auth/login', data).then((response) => {
			if (response.data.error) {
				setErrorMessage(response.data.error);
			} else {
				localStorage.setItem('accessToken', response.data.token);
				setAuthState({
					username: response.data.username,
					id: response.data.id,
					status: true,
				});
				navigate('/');
			}
		});
	};

	return (
		<div className="loginContainer">
			<h1>Se connecter</h1>
			<label>Nom d'utilisateur :</label>
			<input
				type="text"
				onChange={(event) => {
					setUsername(event.target.value);
				}}
			/>
			<label>Mot de passe :</label>
			<input
				type="password"
				onChange={(event) => {
					setPassword(event.target.value);
				}}
			/>
			<span>{errorMessage}</span>

			<button onClick={login} className="loginBtn">
				Se connecter
			</button>
		</div>
	);
}

export default Login;
