const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const db = require("./config/db");


const public_path = path.join(__dirname, '..', 'public');
const server_port = 8000;

app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(public_path)));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(public_path, 'forgetPassword.html')); // ALTERAR POSTERIORMENTE
});

app.post('/', async (req, res) => {
    const insertEmail = String(req.body.userMail);
    const insertPsw = String(req.body.userPassword);

    try{
    let [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [insertEmail]);  

    if(rows.length === 0) {
        return res.send("<script>alert('Usuário não encontrado!'); window.location.href='/';</script>");
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

app.post('/verify-code', async (req, res) => {
    const {code} = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: "Código não enviado!" });
    }

    try{
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE reset_code = ? AND reset_expires > NOW()', [code]
    );

    if(rows.length > 0) {
        res.status(200).json({success: true, message: "Código Verificado!"});
    } else {
        res.status(400).json({success: false, message: "Código inválido ou incorreto!"});
    }
  } catch (error) {
    console.log("Ocorreu um erro ao verificar o tokken", error);
    res.status(500).json({ success : false, message: "Erro de servidor, reinicie e tente novamente!"});
  }

});

app.listen(server_port, () => {
    console.log("O servidor foi iniciado corretamente!");
    console.log("Servidor iniciado em: http://localhost:" + server_port);
})