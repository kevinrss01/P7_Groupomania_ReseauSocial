import { React, useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'; //  for the form
import * as Yup from 'yup'; //For the form validation
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { BiUserCircle } from 'react-icons/bi';
import { RiKey2Fill } from 'react-icons/ri';
import { AiFillFacebook } from 'react-icons/ai';
import { AiOutlineTwitter } from 'react-icons/ai';
import { AiOutlineGoogle } from 'react-icons/ai';

function Registration() {
	const initialValues = {
		username: '',
		password: '',
	};
	let navigate = useNavigate();
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const { setAuthState } = useContext(AuthContext);

	//CONTROLE INPUTs
	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.min(3, "Nom d'utilisateur trop court")
			.max(15, "Le nom d'utilisateur ne peut contenir que 15 caractères")
			.required("Nom d'utilisateur obligatoire"),
		password: Yup.string()
			.min(4, 'Mot de passe trop court')
			.max(20, 'Mot de passe trop long')
			.required('Mot de passe obligatoire'),
	});

	const onSubmit = (data) => {
		axios
			.post('https://groupomania-kevin.herokuapp.com/auth', data)
			.then((response) => {
				if (response.data.error) {
					console.log('username already taken');
					setShowErrorMessage(true);
				} else {
					axios
						.post('https://groupomania-kevin.herokuapp.com/auth/login', data)
						.then((response) => {
							localStorage.setItem('accessToken', response.data.token);
							setAuthState({
								username: response.data.username,
								id: response.data.id,
								status: true,
							});
							navigate('/');
						});
					console.log('user created');
				}
			});
	};

	return (
		<div className="registrationContainer">
			<div className="containerLeftSide">
				<Formik
					initialValues={initialValues}
					onSubmit={onSubmit}
					validationSchema={validationSchema}
				>
					<Form className="formCreateUserContainer">
						<h1>Créer un compte</h1>
						{showErrorMessage && (
							<label className="errorMessage">
								Nom d'utilisateur déja pris, veuillez en choisir un autre.
							</label>
						)}

						<ErrorMessage name="username" component="span" />
						<div className="containerUserNameAndPassword flex_center">
							<BiUserCircle className="iconInput flex_center" />
							<Field
								autoComplete="off"
								id="inputUsername"
								name="username"
								placeholder="Nom d'utilisateur"
							/>
						</div>

						<ErrorMessage name="password" component="span" />
						<div className="containerUserNameAndPassword flex_center">
							<RiKey2Fill className="iconInput flex_center" />
							<Field
								type="password"
								id="inputPassword"
								name="password"
								placeholder="Mot de passe"
							/>
						</div>

						<div className="checkBoxAndLogin flex_center">
							<div className="souvenir flex_center">
								<input type="checkbox" className="rememberCheckbox" />
								<span>Se souvenir de moi</span>
							</div>

							<button type="submit" className="registrationBtn">
								Créer mon compte
							</button>
						</div>

						<div className="regisForgotPassContainer">
							<span
								className="register"
								onClick={() => {
									navigate('/login');
								}}
							>
								Se connecter
							</span>
							<span></span>
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

							<div className="loginWith">
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
					</Form>
				</Formik>
			</div>
			<div className="containerRightSide"></div>
		</div>
	);
}

export default Registration;
