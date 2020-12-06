const mongoose = require('mongoose');
const aws = require('aws-sdk')
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

require('dotenv').config();

const s3 = new aws.S3();

const PostScheema = new mongoose.Schema({
    author: String, 
    place: String,
    description: String,
    hashtags: String,
    image: String,
    key: String,
    likes: {
        type: Number,
        default: 0,
    }
}, {
        /*
        Cria em cada registro da tabela os campos createdAt e updatedAt
        armazenar a data de criacaco e atualizacao
        */
        timestamps: true,
    }
);

PostScheema.pre('remove', function(){

    if (this.image) {
        
        if (process.env.STORAGE_TYPE === 's3'){
            return s3.deleteObject({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: this.image.split('.com/')[1],
            }).promise()
        } else if (process.env.STORAGE_TYPE === "local") {
            return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "uploads","resized", this.image.split('/files/')[1]));
        }

    }

});

module.exports = mongoose.model('Post', PostScheema);