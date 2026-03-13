const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const public_path = path.join(__dirname, '..', 'public');
const server_port = 8000;

const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'Users_Password023',
    database: 'Users_db',
    charset: 'utf8mb4'
});

app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(public_path)));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(public_path, 'login.html'));
});

app.post('/', async (req, res) => {
    const insertEmail = String(req.body.userMail);
    const insertPsw = String(req.body.userPassword);

    try{
    let [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [insertEmail]);  

    if(rows.length === 0) {
        return res.send("<script>alert('Usuário não encontrado!'); window.locate.href='/';</script>");
    }

    const user = rows[0];
    const validationPsw = await bcrypt.compare(insertPsw, user.password);

    if(validationPsw){
        console.log("Usuário verificado, senha correta!");
        res.render('dashboard', {userName: user.name});
    } else {
        res.send("<script>alert('Senha incorreta!'); window.location.href='/';</script>");
    }
    } catch (error) {
        console.error("Erro na conexão: ", error);
        res.status(500).send("Ocorreu um erro ao se conectar com o banco de dados! Tente novamente")
    }
});

app.listen(server_port, () => {
    console.log("O servidor foi iniciado corretamente!");
    console.log("Servidor iniciado em: http://localhost:" + server_port);
})