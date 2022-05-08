import './App.css';
import axios from 'axios'; //Pour les Appels api
import { useEffect, useState } from 'react';

function App() {
	const [listOfPosts, setListOfPosts] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:3002/posts').then((response) => {
			setListOfPosts(response.data);
		});
	}, []);
	return (
		<div className="App">
			{listOfPosts.map((value, key) => {
				return (
					<div className="post">
						<div className="title"> {value.title} </div>
						<div className="body">{value.postText}</div>
						<div className="footer">{value.username}</div>
					</div>
				);
			})}
		</div>
	);
}

export default App;
