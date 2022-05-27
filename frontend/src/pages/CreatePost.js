import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// import { validationSchema } from '../Validations/CreatePost.validation';
import * as Yup from 'yup';

function CreatePost() {
	let navigate = useNavigate();
	const [image, setImage] = useState('');
	const [title, setTitle] = useState(''); //HOLD THE VALUE FOR THE INPUT
	const [postText, setPostText] = useState('');
	const [validation, setValidation] = useState({
		status: true,
	});

	//If not connected redirect to home page
	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			navigate('/login');
		}
	}, []);

	// const initialValues = {
	// 	title: '',
	// 	postText: '',
	// 	image: image,
	// };

	//CONTROL INPUT
	// const validationSchema = Yup.object().shape({
	// 	title: Yup.string().required('Le titre est obligatoire'),
	// 	postText: Yup.string().required('Veuillez écrire quelque chose'),
	// });

	const onSubmit = async () => {
		const formData = new FormData();
		formData.append('image', image.selectedFile);
		formData.append('title', title);
		formData.append('postText', postText);

		if (title != '' && postText != '') {
			axios
				.post('http://localhost:3002/posts', formData, {
					headers: { accessToken: localStorage.getItem('accessToken') },
				})
				.then((response) => {
					navigate('/');
				});
		} else {
			setValidation({
				status: false,
			});
		}
	};

	//CUSTOM BUTTON ADD IMAGE
	const realFileBtn = document.getElementById('inputImage');
	const customTxt = document.getElementById('customText');

	const clickRealButton = () => {
		realFileBtn.click();
	};

	const fileSelectedHandler = (event) => {
		setImage({
			selectedFile: event.target.files[0],
		});
		customTxt.innerHTML = realFileBtn.files[0].name;
		console.log(realFileBtn.files[0].name);
	};

	return (
		<div className="createPostPage">
			<link
				href="https://fonts.googleapis.com/icon?family=Material+Icons"
				rel="stylesheet"
			></link>
			<div className="formContainer">
				<h1>Créer un poste</h1>

				<label>Titre :</label>
				<input
					type="text"
					onChange={(event) => {
						setTitle(event.target.value);
					}}
					name="title"
					className="inputText"
					placeholder="Titre du poste"
				/>
				<label>Contenu du poste :</label>
				<input
					type="text"
					onChange={(event) => {
						setPostText(event.target.value);
					}}
					name="textPost"
					className="inputTextPost"
					placeholder="Quoi de neuf ?"
				/>
				{!validation.status && <span>Veuillez remplir tous les champs</span>}

				<label>Ajouter une image :</label>
				<div className="containerImageUpload">
					<input
						type="file"
						onChange={fileSelectedHandler}
						id="inputImage"
						placeholder="Choisir un fichier"
					/>
					<button id="customButton" onClick={clickRealButton}>
						<p>Ajouter une image</p>
						<span className="material-icons">add_photo_alternate</span>
					</button>
					<span id="customText">Pas d'image ajoutée</span>
				</div>
				<button onClick={onSubmit}> Publier</button>
			</div>

			{/* <Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				encType="multipart/form-data"
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
					<label>Partager une image : </label>
					<inpiut
						type="file"
						name="image"
						onChange={(e) => setImage(e.target.files[0])}
						placeholder="image"
					></inpiut>

					<button type="submit"> Créer le poste</button>
				</Form>
			</Formik> */}
		</div>
	);
}

export default CreatePost;
