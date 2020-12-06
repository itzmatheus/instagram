const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/LikeController');

const routes = new express.Router();
const upload = multer(uploadConfig);

//Posts
routes.get('/posts', PostController.index); 
routes.get('/posts/:id', PostController.indexObj);
routes.post('/posts', upload.single('image'), PostController.store); 
routes.delete('/posts/:id', PostController.delete);
//Posts - Likes
routes.post('/posts/:id/like', LikeController.store); 

module.exports = routes;