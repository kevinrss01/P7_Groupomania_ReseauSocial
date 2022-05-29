import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; //For redirection
// import { AuthContext } from '../helpers/AuthContext';

function Home() {
	const [listOfPosts, setListOfPosts] = useState([]);

	// const { authState } = useContext(AuthContext);
	let navigate = useNavigate();

	//If not connected redirect to home page
	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			navigate('/login');
		} else {
			axios.get('http://localhost:3002/posts').then((response) => {
				setListOfPosts(response.data);
			});
		}
	}, []);

	return (
		<div className="posts">
			{listOfPosts.map((value, key) => {
				return (
					<div className="postsContainer">
						<div key={key} className="post">
							<div className="title"> {value.title} </div>
							<div
								className="body"
								onClick={() => {
									navigate(`/post/${value.id}`);
								}}
							>
								<div className="postText">{value.postText}</div>
								{value.image !== 'undefined' && (
									<img
										src={`http://localhost:3002/${value.image}`}
										alt={value.image}
									/>
								)}
							</div>
							<div className="footer">
								<p>Posté(e) par : </p>
								<Link className="namePost" to={`/profile/${value.UserId}`}>
									<strong>{value.username}</strong>
								</Link>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Home;
