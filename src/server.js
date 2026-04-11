require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const db = require("./config/db");
const mailer = require('./config/mailer');
const session = require('express-session');

app.use(session({
  secret: process.env.SESSIONKEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

const public_path = path.join(__dirname, '..', 'public');
const server_port = process.env.PORT;

app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(public_path)));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

const authRoutes = require('./routes/authRoutes');

app.use('/', authRoutes);

app.listen(server_port, () => {
    console.log("O servidor foi iniciado corretamente!");
    console.log("Servidor iniciado em: http://localhost:" + server_port);
})