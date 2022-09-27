import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function CreatePost() {
	let navigate = useNavigate();
	const [image, setImage] = useState('');
	const [title, setTitle] = useState(''); //HOLD THE VALUE FOR THE INPUT
	const [postText, setPostText] = useState('');
	const [validation, setValidation] = useState({
		status: true,
	});

	//If not connected redirect to login
	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			navigate('/login');
		}
	}, []);

	const onSubmit = async () => {
		const formData = new FormData();
		formData.append('image', image.selectedFile);
		formData.append('title', title);
		formData.append('postText', postText);

		if (title !== '' && postText !== '') {
			axios
				.post('https://groupomania-kevin.herokuapp.com/posts', formData, {
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

	const customTxt = document.getElementById('customText');
	const realFileBtn = document.getElementById('inputImage');

	const clickRealButton = async () => {
		const realFileBtn = document.getElementById('inputImage');
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

				<label> Titre :</label>
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
					<div className="customText">
						<span id="customText">Pas d'image ajoutée</span>
					</div>
				</div>
				<button onClick={onSubmit}> Publier</button>
			</div>
		</div>
	);
}

export default CreatePost;
