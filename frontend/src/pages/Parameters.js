import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../helpers/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

function Parameters() {
	// let askQuestion = false;

	// const showQuestion = () => {
	// 	askQuestion = true;
	// 	console.log(askQuestion);
	// };

	const { authState } = useContext(AuthContext);
	const [username, setUsername] = useState('');
	const [role, setRole] = useState('');

	let navigate = useNavigate();

	//DELETE ACCOUNT
	const deleteAccount = (id) => {
		axios
			.delete(`http://localhost:3002/auth/delete/${id}`, {
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
				{/* {askQuestion ? (
					<>
						<div className="deleteConfirmation">
							<div className="deleteQuestion">
								<p>Voulez-vous vraiment supprimer votre compte ?</p>
							</div>
							<div className="YesOrNo">
								<button className="yes">OUI</button>
								<button className="no">NON</button>
							</div>
						</div>
					</>
				) : (
					<></>
				)} */}
				<button
					className="deleteAccountButton"
					onClick={() => {
						deleteAccount(authState.id);
					}}
				>
					<strong>Supprimer mon compte</strong>
				</button>
			</body>
		</div>
	);
}

export default Parameters;
