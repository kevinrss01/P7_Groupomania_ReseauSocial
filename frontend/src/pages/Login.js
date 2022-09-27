import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { BiUserCircle } from 'react-icons/bi';
import { RiKey2Fill } from 'react-icons/ri';
import { AiFillFacebook } from 'react-icons/ai';
import { AiOutlineTwitter } from 'react-icons/ai';
import { AiOutlineGoogle } from 'react-icons/ai';

function Login() {
	const [username, setUsername] = useState(''); //HOLD THE VALUE FOR THE INPUT
	const [password, setPassword] = useState(''); //HOLD THE VALUE FOR THE INPUT
	const [errorMessage, setErrorMessage] = useState('');
	const { setAuthState } = useContext(AuthContext);

	let navigate = useNavigate();

	const login = () => {
		const data = { username: username, password: password };
		axios
			.post('https://groupomania-kevin.herokuapp.com/auth/login', data)
			.then((response) => {
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
			<div className="containerLeftSide">
				<h1>Se connecter</h1>

				<div className="containerUserNameAndPassword flex_center">
					<BiUserCircle className="iconInput flex_center" />
					<input
						type="text"
						onChange={(event) => {
							setUsername(event.target.value);
						}}
						placeholder="Nom d'utilisateur "
					/>
				</div>

				<div className="containerUserNameAndPassword flex_center">
					<RiKey2Fill className="iconInput flex_center" />
					<input
						type="password"
						onChange={(event) => {
							setPassword(event.target.value);
						}}
						placeholder="Mot de passe "
					/>
				</div>

				<span>{errorMessage}</span>

				<div className="checkBoxAndLogin flex_center">
					<div className="souvenir flex_center">
						<input type="checkbox" className="rememberCheckbox" />
						<span>Se souvenir de moi</span>
					</div>

					<button onClick={login} className="loginBtn">
						Connexion
					</button>
				</div>

				<div className="regisForgotPassContainer">
					<span
						className="register"
						onClick={() => {
							navigate('/registration');
						}}
					>
						S'inscrire
					</span>
					<span>Mot de passe oublié</span>
				</div>

				<div className="divider">
					<hr class="solid"></hr>
					<span>ou</span>
					<hr class="solid"></hr>
				</div>

				<div className="containerLoginWith">
					<div className="loginWith">
						<div className="containerLogo colorFb1">
							<AiFillFacebook className="iconSocialMedia" />
						</div>
						<div className="containerText colorFb2">
							Connexion avec Facebook
						</div>
					</div>

					<div className="loginWith  ">
						<div className="containerLogo colorTwitter1">
							<AiOutlineTwitter className="iconSocialMedia" />
						</div>
						<div className="containerText colorTwitter2">
							Connexion avec Twitter
						</div>
					</div>

					<div className="loginWith">
						<div className="containerLogo colorGoogle1">
							<AiOutlineGoogle className="iconSocialMedia" />
						</div>
						<div className="containerText colorGoogle2">
							Connexion avec Google
						</div>
					</div>
				</div>
			</div>
			<div className="containerRightSide"></div>
		</div>
	);
}

export default Login;
