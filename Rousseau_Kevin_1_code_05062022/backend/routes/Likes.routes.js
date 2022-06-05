const express = require('express');
const router = express.Router();
const { Likes } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddlewares');

router.post('/', validateToken, async (req, res) => {
	const { PostId } = req.body;
	const UserId = req.user.id;

	const found = await Likes.findOne({
		where: { PostId: PostId, UserId: UserId },
	});
	if (!found) {
		await Likes.create({ PostId: PostId, UserId: UserId });
		res.json({ liked: true });
	} else {
		await Likes.destroy({
			where: { PostId: PostId, UserId: UserId },
		});
		res.json({ liked: false });
	}
});

//GET ALL LIKES
router.get('/', validateToken, async (req, res) => {
	const listOfLikes = await Likes.findAll();
	res.json(listOfLikes);
});

//GET ALL LIKES OF ONE USER
router.get('/:id', validateToken, async (req, res) => {
	const id = req.params.id;
	const ListOfLikesByUser = await Likes.findAll({ where: { UserID: id } });
	res.json(ListOfLikesByUser);
});

module.exports = router;
