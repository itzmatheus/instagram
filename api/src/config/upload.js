require('dotenv').config();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const storageTypes = {
    local: new multer.diskStorage({
        dest: path.resolve(__dirname, '..', '..', 'uploads'),   
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
              if (err) cb(err);
      
              file.key = `${hash.toString("hex")}-${file.originalname}`;
      
              cb(null, file.key);
            });
          },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
        // AUTO_CONTENT_TYPE Ler o tipo do arquivo q esta enviando e vai atribuir como content_type
        // para o browser identificar que pode abrir em tela ao inves de realizar download
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: process.env.AWS_S3_PERMISSION,
        key: (req, file, cb) => { // Nome da imagem gravada no s3
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
        
                const fileName = `${hash.toString("hex")}-${file.originalname}`;
        
                cb(null, fileName);
              });
        },
    }),
};

module.exports = {
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/jpg",
            "image/pjpeg",
            "image/png",
            "image/gif"
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."));
        }
    },
}
