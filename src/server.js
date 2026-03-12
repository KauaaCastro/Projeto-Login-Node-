const express = require("express");
const path = require("path");
const app = express();
const PUBLIC_PATH = path.join(__dirname, '..', 'public');
const SERVER_PORT = 8000;

app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(PUBLIC_PATH)));

app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_PATH, 'login.html'));
});

app.listen(SERVER_PORT, () => {
    console.log("O servidor foi iniciado corretamente!");
    console.log("Servidor iniciado em: http://localhost:" + SERVER_PORT);
})