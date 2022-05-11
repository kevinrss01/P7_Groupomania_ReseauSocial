const express = require('express');
const router = express.Router();
const { Posts } = require('../models');

// GET ALL POSTS
router.get('/', async (req, res) => {
	const listOfPosts = await Posts.findAll();
	res.json(listOfPosts);
});

//GET ONE POST
router.get('/byId/:id', async (req, res) => {
	const id = Number(req.params.id);
	const post = await Posts.findByPk(id);
	res.json(post);
});

//CREATE POST
router.post('/', async (req, res) => {
	const post = req.body;
	await Posts.create(post);
	res.json(post);
});

module.exports = router;
