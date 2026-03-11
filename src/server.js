const EXPRESS = require("express");
const PATH = require("path");
const APP = EXPRESS();
const PUBLIC_ENDRESS = PATH.join(__dirname, '..', 'public');
const SERVER_IP = 8000;

APP.use(EXPRESS.urlencoded({extended : true}));
APP.use(EXPRESS.static(PATH.join(PUBLIC_ENDRESS)));

APP.get('/', (req, res) => {
    res.sendFile(PATH.join(PUBLIC_ENDRESS, 'login.html'));
});

APP.listen(SERVER_IP, () => {
    console.log("O servidor foi iniciado corretamente!");
    console.log("Servidor iniciado em: http://localHost:" + SERVER_IP);
})