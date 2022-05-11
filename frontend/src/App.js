import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; //Routes = Switch
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';

function App() {
	return (
		<div className="App">
			<Router>
				<div className="navbar">
					<Link to="createPost"> Créer un poste </Link>
					<Link to="/"> Page d'accueil </Link>
				</div>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/createPost" element={<CreatePost />} />
					<Route path="/post/:id" element={<Post />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
