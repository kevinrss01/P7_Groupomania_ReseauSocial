const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
require('dotenv').config({ path: './config/.env' });

const db = require('./models');

////// Routers //////
//POST
const postRouter = require('./routes/Posts.routes');
app.use('/posts', postRouter);
//COMMENTS
const commentsRouter = require('./routes/comments.routes');
app.use('/comments', commentsRouter);
//USERS|AUTH
const usersRouter = require('./routes/Users.routes');
app.use('/auth', usersRouter);
//LIKES
const likesRouter = require('./routes/Likes.routes');
app.use('/likes', likesRouter);

//Static Images Folder
app.use('/Images', express.static('./Images'));

db.sequelize.sync().then(() => {
	app.listen(3002, () => {
		console.log('Server running on port 3002');
	});
});
