import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; //useNavigate === useHistory
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { AiOutlineMore, AiOutlineCheck } from 'react-icons/ai';

function Post() {
	let { id } = useParams();
	const [postObject, setPostObject] = useState([]);
	const [listOfPosts, setListOfPosts] = useState([]);
	const [comments, setComments] = useState([]); //HOLD THE VALUE FOR THE INPUT
	const [newComment, setNewComment] = useState('');
	const { authState } = useContext(AuthContext);
	const [role, setRole] = useState('');
	const [likedPosts, setLikedPosts] = useState([]);
	const [showParams, setShowParams] = useState(false);
	const [newPost, setNewPost] = useState('');
	const [showInput, setShowInput] = useState(false);
	const [showUpdateCommentInput, setShowUpdateCommentInput] = useState(false);
	const [commentId, setCommentId] = useState('');
	const [updateComment, setUpdateComment] = useState('');

	const paramsToggler = () => {
		if (showInput) {
			setShowInput((p) => !p);
			setShowParams((p) => !p);
		} else {
			setShowParams((p) => !p);
		}
	};

	const inputToggler = () => setShowInput((p) => !p);
	const commentInputToggler = () => {
		setShowUpdateCommentInput((p) => !p);
	};
	let navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`https://groupomania-kevin.herokuapp.com/posts/byId/${id}`)
			.then((response) => {
				setPostObject(response.data);
				setLikedPosts(response.data.Likes);
				console.log(response.data);
			});
		axios
			.get(`https://groupomania-kevin.herokuapp.com/comments/${id}`)
			.then((response) => {
				setComments(response.data);
			});
		axios
			.get('https://groupomania-kevin.herokuapp.com/posts', {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then((response) => {
				setListOfPosts(response.data.listOfPosts);
			});
	}, [id]);

	const getId = (id) => {
		setCommentId(id);
	};

	console.log(postObject);

	//button create comment
	const addComment = () => {
		axios
			.post(
				'https://groupomania-kevin.herokuapp.com/comments',
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
			.delete(`https://groupomania-kevin.herokuapp.com/comments/${id}`, {
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
			.delete(`https://groupomania-kevin.herokuapp.com/posts/${id}`, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then(() => {
				navigate('/');
			});
	};

	// console.log(postObject.Likes.length);
	//GET ROLE
	axios
		.get(
			`https://groupomania-kevin.herokuapp.com/auth/basicinfo/${authState.id}`
		)
		.then((response) => {
			setRole(response.data.role);
		});

	//LIKE POST
	const likeAPost = (postId) => {
		if (localStorage.getItem(`${authState.username}Liked${postId}`)) {
			localStorage.removeItem(`${authState.username}Liked${postId}`);
		} else {
			localStorage.setItem(`${authState.username}Liked${postId}`, postId);
		}
		axios
			.post(
				'https://groupomania-kevin.herokuapp.com/likes',
				{ PostId: postId },
				{ headers: { accessToken: localStorage.getItem('accessToken') } }
			)
			.then((response) => {
				// console.log(response);
				setListOfPosts(
					listOfPosts.map((post) => {
						if (post.id === postId) {
							if (response.data.liked) {
								console.log('1');
								return { ...post, Likes: [...post.Likes, 0] };
							} else {
								console.log('dislike');
								const likesArray = post.Likes;
								likesArray.pop();
								return { ...post, Likes: likesArray };
							}
						} else {
							console.log('2');
							return post;
						}
					})
				);

				if (likedPosts.includes(postId)) {
					setLikedPosts(
						likedPosts.filter((id) => {
							return id !== postId;
						})
					);
				} else {
					setLikedPosts([...likedPosts, postId]);
				}
			});
	};

	//UPDATE POST
	const updatePost = (id) => {
		if (newPost === '') {
			console.log('Input vide');
		} else {
			axios
				.put(
					`https://groupomania-kevin.herokuapp.com/posts/${id}`,
					{ postText: newPost },
					{ headers: { accessToken: localStorage.getItem('accessToken') } }
				)
				.then((response) => {
					console.log('UPDATE DONE');
					window.location.reload(false);
				});
		}
	};

	//UPDATE COMMENT
	const sendUpdateComment = (id) => {
		if (updateComment === '') {
			console.log('Input vide');
		} else {
			axios
				.put(
					`https://groupomania-kevin.herokuapp.com/comments/${id}`,
					{ commentBody: updateComment },
					{ headers: { accessToken: localStorage.getItem('accessToken') } }
				)
				.then((response) => {
					console.log('UPDATE SUCCESSFULL');
					window.location.reload(false);
				});
		}
	};

	//ICON
	const Params = () => {
		return <AiOutlineMore className="params" onClick={paramsToggler} />;
	};
	const ValidUpdate = () => {
		return <AiOutlineCheck className="valid" />;
	};

	console.log(likedPosts);

	return (
		<div className="postPage">
			<div className="leftSide">
				<div className="post" id="individual">
					<div className="title">{postObject.title}</div>
					<div className="bodyIndividual">
						{showInput ? (
							<>
								<div className="updatePost">
									<button
										className="updateButton"
										on
										onClick={() => {
											updatePost(postObject.id);
										}}
									>
										<ValidUpdate />
									</button>
									<input
										type="text"
										onChange={(event) => {
											setNewPost(event.target.value);
										}}
									/>
								</div>
							</>
						) : (
							<div className="postText">{postObject.postText}</div>
						)}

						{postObject.image !== 'undefined' && (
							<img
								src={`https://groupomania-kevin.herokuapp.com/${postObject.image}`}
								alt={postObject.image}
							/>
						)}
					</div>
					{showParams && (
						<div className="parameters">
							{showInput ? (
								<button onClick={inputToggler}>Annuler</button>
							) : (
								<>
									<button onClick={inputToggler}>Modifier</button>
									<button
										onClick={() => {
											deletePost(postObject.id);
										}}
									>
										Supprimer
									</button>
								</>
							)}
						</div>
					)}

					<div className="footer">
						<Link className="namePost" to={`/profile/${postObject.UserId}`}>
							<strong>{postObject.username}</strong>
						</Link>
						<div className="commentsAndLikes">
							<FontAwesomeIcon
								onClick={() => {
									likeAPost(postObject.id);
								}}
								icon={faHeart}
								className={
									localStorage.getItem(
										`${authState.username}Liked${postObject.id}`
									)
										? 'unlikePost'
										: 'likePost'
								}
							></FontAwesomeIcon>
							{/* <p>{likedPosts.length}</p> */}
						</div>

						{/*control if you are the creator or admin*/}
						{authState.username === postObject.username || role === 'admin' ? (
							<>
								<Params />
							</>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>

			{/* Comments Side */}

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
								<p className="textComment">
									{showUpdateCommentInput && commentId === comment.id ? (
										<>
											<input
												className="inputUpdateComment"
												type="text"
												onChange={(event) => {
													setUpdateComment(event.target.value);
												}}
											/>
											<button
												className="newCommentBtn"
												onClick={() => {
													sendUpdateComment(comment.id);
												}}
											>
												Valider
											</button>
										</>
									) : (
										<>{comment.commentBody}</>
									)}
								</p>
								<div className="footerComment">
									<label>
										Posté(e) par : <strong>{comment.username}</strong>
									</label>

									{authState.username === comment.username ||
									role === 'admin' ? (
										<>
											{showUpdateCommentInput && commentId === comment.id ? (
												<button
													className="updateCommentBtn"
													onClick={() => {
														commentInputToggler();
													}}
												>
													<span>
														<strong>Annuler</strong>
													</span>
												</button>
											) : (
												<button
													className="updateCommentBtn"
													onClick={() => {
														commentInputToggler();
														getId(comment.id);
													}}
												>
													<span>
														<strong>Modifier</strong>
													</span>
												</button>
											)}

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
										</>
									) : (
										<></>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Post;
