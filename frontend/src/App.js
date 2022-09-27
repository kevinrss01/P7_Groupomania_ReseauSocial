import '../src/CSS/main.css';
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
import logoGroupomania from './Images/icon-left-font-monochrome-white.png';
import { AiOutlineClose } from 'react-icons/ai';
import { BiMenuAltRight } from 'react-icons/bi';

//ROUTES "pages"
//NAVBAR AND LINKS
function App() {
	// const [role, setRole] = useState('');
	const [authState, setAuthState] = useState({
		username: '',
		id: 0,
		role: '',
		status: false,
		// postsLiked: [],
	});

	const [menuOpen, setMenuOpen] = useState(false);
	const menuToggler = () => setMenuOpen((p) => !p);

	useEffect(() => {
		axios
			.get('https://groupomania-kevin.herokuapp.com/auth/auth', {
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

	const Button = () => {
		return (
			<button className="btnResponsive" onClick={menuToggler}>
				<BiMenuAltRight />
			</button>
		);
	};

	const ButtonClose = () => {
		return (
			<button className="btnResponsive2" onClick={menuToggler}>
				<AiOutlineClose />
			</button>
		);
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
						<Link to="/" id="logo">
							<img src={logoGroupomania} />
						</Link>
						{/*BUTTON RESPOSIVE*/}
						{menuOpen ? <ButtonClose /> : <Button />}

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
					{menuOpen && (
						<div id="navbarResponsive">
							{!authState.status ? (
								/*IF NOT LOGGED SHOW :*/
								<>
									<div className="loginRegistration">
										<Link to="/login"> Se connecter </Link>
										<Link to="/registration"> Créer un compte </Link>
									</div>
								</>
							) : (
								/*IF LOGGED SHOW :*/
								<>
									<div className="createPost">
										<Link to="createPost">Créer un poste</Link>
										<Link to="/"> Page d'accueil </Link>
									</div>
								</>
							)}
							{authState.status && (
								<>
									<div className="params">
										<Link to="/parameters">
											Parametres{' '}
											<FontAwesomeIcon
												icon={faGear}
												className="gearIcon"
											></FontAwesomeIcon>
										</Link>

										<Link to="/login">
											<button onClick={logout}>Se déconnecter</button>
										</Link>
									</div>
								</>
							)}
						</div>
					)}

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
