import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; //useNavigate === useHistory
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';
// import Image from '/Images';

function Post() {
	let { id } = useParams();
	const [postObject, setPostObject] = useState({});
	const [comments, setComments] = useState([]); //HOLD THE VALUE FOR THE INPUT
	const [newComment, setNewComment] = useState('');
	const { authState } = useContext(AuthContext);
	const [role, setRole] = useState('');
	let navigate = useNavigate();

	useEffect(() => {
		axios.get(`http://localhost:3002/posts/byId/${id}`).then((response) => {
			setPostObject(response.data);
			console.log(response.data);
		});
		axios.get(`http://localhost:3002/comments/${id}`).then((response) => {
			setComments(response.data);
		});
	}, [id]);

	//button create comment
	const addComment = () => {
		axios
			.post(
				'http://localhost:3002/comments',
				{
					commentBody: newComment,
					PostId: id,
				},
				{
					headers: {
						accessToken: localStorage.getItem('accessToken'),
					},
				}
			)
			.then((response) => {
				if (response.data.error) {
					console.log(response.data.error);
				} else {
					const commentToAdd = {
						commentBody: newComment,
						username: response.data.username,
						id: response.data.id,
					}; //For add comment without reload
					setComments([...comments, commentToAdd]); //For add comment without reload
					setNewComment(''); //For clear the input after submit
				}
			});
	};

	//DELETE COMMENT
	const deleteComment = (id) => {
		axios
			.delete(`http://localhost:3002/comments/${id}`, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then(() => {
				setComments(
					comments.filter((val) => {
						return val.id !== id;
					})
				);
			});
	};

	//DELETE POST
	const deletePost = (id) => {
		axios
			.delete(`http://localhost:3002/posts/${id}`, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then(() => {
				navigate('/');
			});
	};

	//GET ROLE
	axios
		.get(`http://localhost:3002/auth/basicinfo/${authState.id}`)
		.then((response) => {
			setRole(response.data.role);
		});

	return (
		<div className="postPage">
			<div className="leftSide">
				<div className="post" id="individual">
					<div className="title">{postObject.title}</div>
					<div className="body">
						<div>{postObject.postText}</div>
						{postObject.image != 'undefined' && (
							<img
								src={`http://localhost:3002/${postObject.image}`}
								alt={postObject.image}
							/>
						)}
					</div>
					<div className="footer">
						{postObject.username}
						{/*control if you are the creator or admin*/}
						{authState.username === postObject.username || role === 'admin' ? (
							<button
								onClick={() => {
									deletePost(postObject.id);
								}}
							>
								<strong>Supprimer le poste</strong>
							</button>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>

			<div className="rightSide">
				<div className="addCommentContainer">
					{!authState.status ? (
						/*IF NOT LOGGIN SHOW :*/
						<h1>
							Veuillez vous connecter
							<br />
							pour publier un commentaire
						</h1>
					) : (
						/*IF LOGGIN SHOW :*/
						<>
							<h1>Ajouter un commentaire</h1>

							<input
								type="text"
								placeholder="Ajouter un commentaire..."
								value={newComment}
								onChange={(event) => {
									setNewComment(event.target.value); //for collect the content of the input
								}}
							/>
							<button onClick={addComment}> Publier </button>
						</>
					)}
				</div>
				<div className="listOfComments">
					{comments.map((comment, key) => {
						return (
							<div key={key} className="comment">
								<p className="textComment">{comment.commentBody}</p>
								<label>Posté(e) par : {comment.username}</label>
								{authState.username === comment.username || role === 'admin' ? (
									<button
										className="deleteBtn"
										onClick={() => {
											deleteComment(comment.id);
										}}
									>
										<span>
											<strong>Supprimer</strong>
										</span>
									</button>
								) : (
									<></>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Post;
