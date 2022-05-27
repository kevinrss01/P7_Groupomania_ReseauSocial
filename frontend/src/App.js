import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; //Routes = Switch
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Registration from './pages/Registration';
import ProfilePage from './pages/ProfilePage';
import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Parameters from './pages/Parameters';

//ROUTES "pages"
//NAVBAR AND LINKS
function App() {
	// const [role, setRole] = useState('');
	const [authState, setAuthState] = useState({
		username: '',
		id: 0,
		role: '',
		status: false,
	});

	useEffect(() => {
		axios
			.get('http://localhost:3002/auth/auth', {
				headers: {
					accessToken: localStorage.getItem('accessToken'),
				},
			})
			.then((response) => {
				if (response.data.error) {
					setAuthState({
						...authState,
						status: false,
					});
				} else {
					setAuthState({
						username: response.data.username,
						id: response.data.id,
						role: response.data.role,
						status: true,
					});
				}
			});
	}, []);

	//LOGOUT
	const logout = () => {
		localStorage.removeItem('accessToken');
		setAuthState({
			username: '',
			id: 0,
			role: '',
			status: false,
		});
	};

	return (
		<div className="App">
			<AuthContext.Provider value={{ authState, setAuthState }}>
				<Router>
					<div className="navbar">
						{!authState.status ? (
							/*IF NOT LOGGED SHOW :*/
							<>
								<div className="connectAndRegister">
									<Link to="/login"> Se connecter </Link>
									<Link to="/registration"> Créer un compte </Link>
								</div>
							</>
						) : (
							/*IF LOGGED SHOW :*/
							<>
								<div className="CreateAndMainPage">
									<Link to="createPost"> Créer un poste </Link>
									<Link to="/"> Page d'accueil </Link>
								</div>
							</>
						)}
						{authState.status && (
							<>
								<div className="navbarRight">
									<Link to="/parameters">
										<FontAwesomeIcon
											icon={faGear}
											className="gearIcon"
										></FontAwesomeIcon>
									</Link>

									<h1>Bonjour {authState.username}</h1>
									<Link to="/login">
										<button onClick={logout}>Se déconnecter</button>
									</Link>
								</div>
							</>
						)}
					</div>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/createPost" element={<CreatePost />} />
						<Route path="/post/:id" element={<Post />} />
						<Route path="/registration" element={<Registration />} />
						<Route path="/login" element={<Login />} />
						<Route path="/profile/:id" element={<ProfilePage />} />
						<Route path="*" element={<PageNotFound />} />
						<Route path="/parameters" element={<Parameters />} />
					</Routes>
				</Router>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
