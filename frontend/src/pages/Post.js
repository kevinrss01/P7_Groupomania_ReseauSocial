import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; //useNavigate === useHistory
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function Post() {
	let { id } = useParams();
	const [postObject, setPostObject] = useState([]);
	const [listOfPosts, setListOfPosts] = useState([]);
	const [comments, setComments] = useState([]); //HOLD THE VALUE FOR THE INPUT
	const [newComment, setNewComment] = useState('');
	const { authState } = useContext(AuthContext);
	const [role, setRole] = useState('');
	const [likedPosts, setLikedPosts] = useState([]);

	let navigate = useNavigate();

	useEffect(() => {
		axios.get(`http://localhost:3002/posts/byId/${id}`).then((response) => {
			setPostObject(response.data);
			setLikedPosts(response.data.Likes);
			console.log(response.data);
		});
		axios.get(`http://localhost:3002/comments/${id}`).then((response) => {
			setComments(response.data);
		});
		axios
			.get('http://localhost:3002/posts', {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then((response) => {
				setListOfPosts(response.data.listOfPosts);
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

	// Object.keys(postObject).map((x) => console.log(x));
	//LIKE POST
	const likeAPost = (postId) => {
		if (localStorage.getItem(`${authState.username}Liked${postId}`)) {
			localStorage.removeItem(`${authState.username}Liked${postId}`);
		} else {
			localStorage.setItem(`${authState.username}Liked${postId}`, postId);
		}
		axios
			.post(
				'http://localhost:3002/likes',
				{ PostId: postId },
				{ headers: { accessToken: localStorage.getItem('accessToken') } }
			)
			.then((response) => {
				// console.log(response.data.liked);
				// console.log(postObject);
				// Object.entries(postObject).map((x) => console.log(x));
				setListOfPosts(
					listOfPosts.map((post) => {
						if (post.id === postId) {
							if (response.data.liked) {
								// console.log('like');
								return { ...post, Likes: [...post.Likes, 0] };
							} else {
								// console.log('dislike');
								const likesArray = post.Likes;
								likesArray.pop();
								return { ...post, Likes: likesArray };
							}
						} else {
							console.log('post.id === postId is FALSE');
							return post;
						}
					})
				);
			});
	};

	return (
		<div className="postPage">
			<div className="leftSide">
				<div className="post" id="individual">
					<div className="title">{postObject.title}</div>
					<div className="bodyIndividual">
						<div className="postText">{postObject.postText}</div>
						{postObject.image !== 'undefined' && (
							<img
								src={`http://localhost:3002/${postObject.image}`}
								alt={postObject.image}
							/>
						)}
					</div>
					<div className="footer">
						<Link className="namePost" to={`/profile/${postObject.UserId}`}>
							<strong>{postObject.username}</strong>
						</Link>
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

						{/*control if you are the creator or admin*/}
						{authState.username === postObject.username || role === 'admin' ? (
							<>
								{/* <label>{likedPosts.length}</label> */}
								<button
									onClick={() => {
										deletePost(postObject.id);
									}}
								>
									<strong>Supprimer le poste</strong>
								</button>
							</>
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
								<label>
									Posté(e) par : <strong>{comment.username}</strong>
								</label>
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
