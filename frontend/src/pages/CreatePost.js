import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
	let navigate = useNavigate(console.log('Post sent succesfully'));

	const initialValues = {
		title: '',
		postText: '',
		username: '',
	};

	const validationSchema = Yup.object().shape({
		title: Yup.string().required('Le titre est obligatoire'),
		postText: Yup.string().required('Veuillez écrire quelque chose'),
		username: Yup.string().min(3).max(15).required(''),
	});

	const onSubmit = (data) => {
		axios.post('http://localhost:3002/posts', data).then((response) => {
			navigate('/');
		});
	};

	return (
		<div className="createPostPage">
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
			>
				<Form className="formContainer">
					<label>Titre : </label>
					<ErrorMessage name="title" component="span" />
					<Field id="inputCreatePost" name="title" placeholder="Titre" />
					<label>Contenu du poste : </label>
					<ErrorMessage name="postText" component="span" />
					<Field
						id="inputTextPost"
						name="postText"
						placeholder="Quoi de neuf ?"
					/>
					<label>Username : </label>
					<ErrorMessage name="username" component="span" />
					<Field id="inputCreatePost" name="username" placeholder="Username" />

					<button type="submit"> Create Post</button>
				</Form>
			</Formik>
		</div>
	);
}

export default CreatePost;
