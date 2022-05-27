const express = require('express');
const router = express.Router();
const { Posts } = require('../models');
const multer = require('multer');
const path = require('path');
const { validateToken } = require('../middlewares/AuthMiddlewares');
//const fs = require('fs');

// GET ALL POSTS
router.get('/', async (req, res) => {
	const listOfPosts = await Posts.findAll();
	res.json(listOfPosts);
});

//GET ONE POST
router.get('/byId/:id', async (req, res) => {
	const id = req.params.id;
	const post = await Posts.findByPk(id);
	res.json(post);
});

//GET ALL POST OF ONE USER
router.get('/byuserId/:id', async (req, res) => {
	const id = req.params.id;
	const listOfPosts = await Posts.findAll({ where: { UserID: id } });
	res.json(listOfPosts);
});

//CREATE POST

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'Images');
	},
	filename: (req, file, cb) => {
		console.log(file);
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: '5000000' },
	fileFilter: (req, file, cb) => {
		const fileTypes = /jpeg|jpg|png|gif/;
		const mimeType = fileTypes.test(file.mimetype);
		const extname = fileTypes.test(path.extname(file.originalname));

		if (mimeType && extname) {
			return cb(null, true);
		}
		cb('Give proper files formate to upload');
	},
});

router.post('/', validateToken, upload.single('image'), async (req, res) => {
	const post = req.body;
	if (req.file === undefined) {
		post.username = req.user.username;
		post.UserId = req.user.id;
		await Posts.create(post);
		res.json(post);
	} else {
		post.image = req.file.path;
		post.username = req.user.username;
		post.UserId = req.user.id;
		await Posts.create(post);
		res.json(post);
	}
});

//DELETE POST
router.delete('/:postId', validateToken, async (req, res) => {
	const postId = req.params.postId;

	await Posts.destroy({
		where: {
			id: postId,
		},
	});

	res.json('DELETED SUCCESSFULLY');
});

//DELETE ALL POSTS OF ONE USER
// router.delete('/deleteallposts/:userId', validateToken, async (req, res) => {
// 	const userId = req.params.userId;

// 	await Posts.destroy({
// 		where: {
// 			userId: userId,
// 		},
// 	});

// 	res.json('DELETED SUCCESSFULLY');
// });

module.exports = router;
