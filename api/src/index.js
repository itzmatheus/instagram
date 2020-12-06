const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const mongoUrl = process.env.urlMongo;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true, // Configuracao para identificar o formato da conexao nova a partir de uma String.
    useUnifiedTopology: true
});

app.use((req, resp, next) => {
    req.io = io;

    next(); // Garantirá que esse middleware seja executado, porem os outros middlewares executados depois
            // tambem sejam executados
});

app.use(cors());

app.use(express.json()); // Consegue lidar com corpo de mensagens vindos no formato JSON
app.use(express.urlencoded({ extended: true })); // Consegue lidar com requisições no padrao URL Encoded
app.use(morgan('dev')); // Lib de logs

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'));

server.listen(process.env.PORT || 8080);
