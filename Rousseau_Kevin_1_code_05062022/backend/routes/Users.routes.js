const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { Posts } = require('../models');
const { Comments } = require('../models');
const { Likes } = require('../models');
const bcrypt = require('bcrypt');
const { validateToken } = require('../middlewares/AuthMiddlewares');
const { sign } = require('jsonwebtoken');

//REGISTRATION
router.post('/', async (req, res) => {
	const { username, password } = req.body;
	const findUser = await Users.findOne({ where: { username: username } });
	if (findUser) {
		res.json({ error: "Nom d'utilisateur déja pris" });
	} else {
		bcrypt.hash(password, 10).then((hash) => {
			Users.create({
				username: username,
				password: hash,
			});
			res.json('User registered');
		});
	}
});

////LOGIN/////
router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await Users.findOne({ where: { username: username } }); //Check username
	// const ListOfLikesByUser = await Likes.findAll({ where: { UserID: user.id } });

	if (user)
		//bcrypt.compare(passwordInTheInput, passwordInTheDataBase)
		bcrypt.compare(password, user.password).then((match) => {
			if (!match)
				res.json({ error: "Nom d'utilisateur ou mot de passe incorrecte" });
			else {
				const accessToken = sign(
					{ username: user.username, id: user.id },
					process.env.TOKEN_SECRET
				);
				res.json({
					token: accessToken,
					username: username,
					id: user.id,
				});
			}
		});
	else {
		//if doesn't exist
		res.json({ error: "L'utilisateur n'existe pas" });
	}
});

//auth request
router.get('/auth', validateToken, (req, res) => {
	res.json(req.user);
});

//PROFIL PAGE
router.get('/basicinfo/:id', async (req, res) => {
	const id = req.params.id;

	const basicInfo = await Users.findByPk(id, {
		attributes: { exclude: ['password'] },
	});

	res.json(basicInfo);
});

//DELETE USER
router.delete('/delete/:id', validateToken, async (req, res) => {
	const id = req.params.id;

	await Users.destroy({
		where: {
			id: id,
		},
	});

	await Posts.destroy({
		where: {
			userId: id,
		},
	});

	await Comments.destroy({
		where: {
			UserId: id,
		},
	});

	res.json('delete successfully');
});

//FOR TEST
router.get('/getUsers', async (req, res) => {
	const listOfUsers = await Users.findAll();
	res.json(listOfUsers);
});

module.exports = router;
