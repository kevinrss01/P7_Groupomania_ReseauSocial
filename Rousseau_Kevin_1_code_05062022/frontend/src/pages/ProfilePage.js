import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { BiCommentDetail } from 'react-icons/bi';

function ProfilePage() {
	let { id } = useParams();

	const [username, setUsername] = useState('');
	// const [comments, setComments] = useState([]);
	const { authState } = useContext(AuthContext);
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
	}, []);

	//ICON
	const Comment = () => {
		return <BiCommentDetail className="comments" />;
	};

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
				setListOfPost(
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
		<div className="profilePageContainer">
			<div className="basicInfo">
				<h1>Page profile de {username}</h1>

				<h3>Tous les postes que {username} à publier :</h3>
			</div>
			<div className="listOfPosts">
				{listOfPosts.map((value, key) => {
					return (
						<div key={key} className="post">
							<div className="title"> {value.title} </div>
							<div
								className="body"
								onClick={() => {
									navigate(`/post/${value.id}`);
								}}
							>
								<p>{value.postText}</p>
								{value.image !== 'undefined' && (
									<img
										src={`http://localhost:3002/${value.image}`}
										alt={value.image}
									/>
								)}
							</div>
							<div className="footer">
								<p>{value.username}</p>
								<div className="commentsAndLikes">
									<Comment />
									<p>{value.Comments.length}</p>
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
									<p>{value.Likes.length}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<div className="basicInfo"></div>
			<div className="lisOfPosts"></div>
		</div>
	);
}

export default ProfilePage;
