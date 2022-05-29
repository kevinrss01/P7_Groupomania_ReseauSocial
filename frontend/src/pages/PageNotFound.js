import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
	return (
		<div className="pageNotFound">
			<h1>Page introuvable :/</h1>
			<h3>
				Aller à la page d'accueil :<Link to="/"> Page d'accueil </Link>
			</h3>
		</div>
	);
}

export default PageNotFound;
