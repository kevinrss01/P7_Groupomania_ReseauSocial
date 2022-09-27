import React from 'react';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; //For redirection
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../helpers/AuthContext';

import { BiCommentDetail } from 'react-icons/bi';

function Home() {
	const [listOfPosts, setListOfPosts] = useState([]);
	const [likedPosts, setLikedPosts] = useState([]);
	const { authState } = useContext(AuthContext);

	let navigate = useNavigate();

	const Comment = () => {
		return <BiCommentDetail className="comments" />;
	};

	useEffect(() => {
		//If not connected redirect to home page
		if (!localStorage.getItem('accessToken')) {
			navigate('/login');
		} else {
			axios
				.get('https://groupomania-kevin.herokuapp.com/posts', {
					headers: { accessToken: localStorage.getItem('accessToken') },
				})
				.then((response) => {
					setListOfPosts(response.data.listOfPosts);
					setLikedPosts(
						response.data.likedPosts.map((like) => {
							if (likedPosts.includes(like.postId)) {
								setLikedPosts(
									likedPosts.filter((id) => {
										return id !== like.postId;
									})
								);
							} else {
								setLikedPosts([...likedPosts, like.postId]);
							}
							return like.PostId;
						})
					);
				});
		}
	}, []);

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
				setListOfPosts(
					listOfPosts.map((post) => {
						if (post.id === postId) {
							if (response.data.liked) {
								console.log('like');
								return { ...post, Likes: [...post.Likes, 0] };
							} else {
								console.log('dislike');
								const likesArray = post.Likes;
								likesArray.pop();
								return { ...post, Likes: likesArray };
							}
						} else {
							return post;
						}
					})
				);

				// if (likedPosts.includes(postId)) {
				// 	setLikedPosts(
				// 		likedPosts.filter((id) => {
				// 			return id != postId;
				// 		})
				// 	);
				// } else {
				// 	setLikedPosts([...likedPosts, postId]);
				// }
			});
	};

	return (
		<div className="posts">
			{listOfPosts.map((value, key) => {
				return (
					<div className="postsContainer">
						<div key={key} className="post">
							<div className="title">{value.title}</div>
							<div
								className="body"
								onClick={() => {
									navigate(`/post/${value.id}`);
								}}
							>
								<div className="postText">{value.postText}</div>
								{value.image !== 'undefined' && (
									<img
										src={`https://groupomania-kevin.herokuapp.com/${value.image}`}
										alt={value.image}
									/>
								)}
							</div>
							<div className="footer">
								<div className="postBy">
									<p className="postByText">Posté(e) par : </p>
									<Link className="namePost" to={`/profile/${value.UserId}`}>
										<p>{value.username}</p>
									</Link>
								</div>

								<div className="likes">
									<Comment />
									<label>{value.Comments.length}</label>
									<FontAwesomeIcon
										onClick={() => {
											likeAPost(value.id);
										}}
										icon={faHeart}
										className={
											// likeOfUser.some((item) => item.PostId === value.id)
											// likedPosts.includes(value.id)
											localStorage.getItem(
												`${authState.username}Liked${value.id}`
											)
												? 'unlikePost'
												: 'likePost'
										}
									></FontAwesomeIcon>

									<label>{value.Likes.length}</label>
								</div>
							</div>
							{/* <div className="heart-btn">
								<div className="content">
									<span className="heart"></span>
									<span className="like">Like</span>
									<span className="numb">{value.Likes.length}</span>
								</div>
							</div> */}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Home;
