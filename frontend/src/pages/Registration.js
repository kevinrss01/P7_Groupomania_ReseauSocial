import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'; //  for the form
import * as Yup from 'yup'; //For the form validation
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../helpers/AuthContext';

function Registration() {
	const initialValues = {
		username: '',
		password: '',
	};

	// const { setAuthState } = useContext(AuthContext);

	//CONTROLE INPUT
	const validationSchema = Yup.object().shape({
		username: Yup.string()
			.min(3)
			.max(15)
			.required("Nom d'utilisateur obligatoire"),
		password: Yup.string().min(4).max(20).required('Mot de passe obligatoire'),
	});

	const onSubmit = (data) => {
		axios.post('http://localhost:3002/auth', data).then(() => {
			console.log(data);
			navigate('/login');
		});
	};

	let navigate = useNavigate();

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

					<button type="submit"> Créer mon compte</button>
				</Form>
			</Formik>
		</div>
	);
}

export default Registration;
