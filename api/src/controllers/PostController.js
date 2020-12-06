const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
require('dotenv').config()

module.exports = {
    async index(req, res) {
        const posts = await Post.find().sort('-createdAt');
        return res.json(posts);
    },

    async indexObj(req, res) {
        const post = await Post.findById(req.params.id);
        return res.json(post);
    },

    async store(req, res) {
        
        const { author, place, description, hashtags } = req.body;
        let fileName = "";

        if (req.file){

            const { filename: image, key: key, location: url = "" } = req.file;  
            fileName = url;

            if ( (process.env.STORAGE_TYPE === 'local') && req.file) { 

                const [name] = image.split('.');

                fileName = `http://${process.env.APP_HOST}/files/${name}.jpg`;
                console.log("aa" + fileName)
                await sharp(req.file.path)
                .resize(500)
                .jpeg({ quality: 70 })
                .toFile(
                    path.resolve(req.file.destination, 'resized', name + '.jpg') 
                );
        
                fs.unlinkSync(req.file.path);

            }
        }

        const post = await Post.create({
            author,
            place, 
            description,
            hashtags,
            image: fileName,
        }); 

        req.io.emit('post', post);

        return res.json(post);
    },

    async delete(req, res) {

        const post = await Post.findById(req.params.id);
        await post.remove();
        return res.json({
            mensagem: "Postagem deletada com sucesso",
        });
    },

};