import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
	let { id } = useParams();
	const [username, setUsername] = useState('');
	// const [role, setRole] = useState('');

	const [listOfPosts, setListOfPost] = useState([]);
	let navigate = useNavigate();

	useEffect(() => {
		axios.get(`http://localhost:3002/auth/basicinfo/${id}`).then((response) => {
			setUsername(response.data.username);
		});

		axios.get(`http://localhost:3002/posts/byuserid/${id}`).then((response) => {
			setListOfPost(response.data);
		});
	}, [id]);
	return (
		<div className="profilePageContainer">
			<div className="basicInfo">
				<h1>Page profile de {username}</h1>

				<h3>Tous les postes que {username} à publier :</h3>
				<div className="listOfPosts">
					{listOfPosts.map((value, key) => {
						return (
							<div
								key={key}
								className="post"
								onClick={() => {
									navigate(`/post/${value.id}`);
								}}
							>
								<div className="title"> {value.title} </div>
								<div className="body">
									{value.postText}
									{value.image !== 'undefined' && (
										<img
											src={`http://localhost:3002/${value.image}`}
											alt={value.image}
										/>
									)}
								</div>
								<div className="footer">{value.username}</div>
							</div>
						);
					})}
				</div>
			</div>
			<div className="basicInfo"></div>
			<div className="lisOfPosts"></div>
		</div>
	);
}

export default ProfilePage;
