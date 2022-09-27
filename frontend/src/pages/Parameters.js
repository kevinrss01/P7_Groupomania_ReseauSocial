import React, { useContext, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';

function Parameters() {
	const { authState } = useContext(AuthContext);

	const [confirmation, setConfirmation] = useState({
		show: false,
	});

	let navigate = useNavigate();

	const showQuestion = () => {
		setConfirmation({
			show: true,
		});
	};

	const hideQuestion = () => {
		setConfirmation({
			show: false,
		});
	};

	//DELETE ACCOUNT
	const deleteAccount = (id) => {
		axios
			.delete(`https://groupomania-kevin.herokuapp.com/auth/delete/${id}`, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then(() => {
				localStorage.removeItem('accessToken');
				navigate('/');
				window.location.reload(false);
			});
	};

	return (
		<div className="parametersPage">
			<div className="headerParams">
				<h1>Paramètres du compte de {authState.username}</h1>

				<FontAwesomeIcon icon={faGear} className="gearIcon"></FontAwesomeIcon>
			</div>
			<div className="headerParams">
				{authState.role === 'admin' ? (
					<>
						<h1>Vous êtes administrateur</h1>
					</>
				) : (
					<></>
				)}
			</div>

			<body className="bodyParameters">
				{confirmation.show === true && (
					<>
						<div className="deleteConfirmation">
							<div className="deleteQuestion">
								<p>Voulez-vous vraiment supprimer votre compte ?</p>
							</div>
							<div className="YesOrNo">
								<button
									className="yes"
									onClick={() => {
										deleteAccount(authState.id);
									}}
								>
									OUI
								</button>
								<button className="no" onClick={hideQuestion}>
									NON
								</button>
							</div>
						</div>
					</>
				)}
				{confirmation.show === false && (
					<button className="deleteAccountButton" onClick={showQuestion}>
						<strong>Supprimer mon compte</strong>
					</button>
				)}
			</body>
		</div>
	);
}

export default Parameters;
