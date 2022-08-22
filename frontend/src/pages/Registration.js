import { React, useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'; //  for the form
import * as Yup from 'yup'; //For the form validation
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Registration() {
	const initialValues = {
		username: '',
		password: '',
	};
	let navigate = useNavigate();
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const { setAuthState } = useContext(AuthContext);

	//CONTROLE INPUT
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
		axios.post('http://localhost:3002/auth', data).then((response) => {
			if (response.data.error) {
				console.log('username already taken');
				setShowErrorMessage(true);
			} else {
				axios
					.post('http://localhost:3002/auth/login', data)
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
			<h1>Créer un compte</h1>
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
			>
				<Form className="formCreateUserContainer">
					<label>Nom d'utilisateur :</label>
					{showErrorMessage && (
						<label className="errorMessage">
							Nom d'utilisateur déja pris, veuillez en choisir un autre.
						</label>
					)}

					<ErrorMessage name="username" component="span" />
					<Field
						autoComplete="off"
						id="inputUsername"
						name="username"
						placeholder="Nom d'utilisateur"
					/>
					<label>Mot de passe :</label>
					<ErrorMessage name="password" component="span" />
					<Field
						type="password"
						id="inputPassword"
						name="password"
						placeholder="Mot de passe"
					/>

					<button type="submit" className="registrationBtn">
						Créer mon compte
					</button>
				</Form>
			</Formik>
		</div>
	);
}

export default Registration;
