const express = require('express');
const router = express.Router();
const { Comments } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddlewares');

// GET ALL COMMENTS
router.get('/:postId', async (req, res) => {
	const postId = req.params.postId;
	const comments = await Comments.findAll({ where: { PostId: postId } });
	res.json(comments);
});

//CREATE COMMENTS
router.post('/', validateToken, async (req, res) => {
	const comment = req.body;
	const username = req.user.username;
	comment.username = username;
	comment.UserId = req.user.id;
	const newComment = await Comments.create(comment);
	res.json(newComment);
});

//DELETE COMMENT
router.delete('/:commentId', validateToken, async (req, res) => {
	const commentId = req.params.commentId;

	await Comments.destroy({
		where: {
			id: commentId,
		},
	});

	res.json('DELETED SUCCESSFULLY');
});

//UPDATE COMMENT
router.put('/:id', validateToken, async (req, res) => {
	const id = req.params.id;
	const commentBody = req.body.commentBody;
	await Comments.update({ commentBody: commentBody }, { where: { id: id } });

	res.json('Comment Update !');
});

module.exports = router;
