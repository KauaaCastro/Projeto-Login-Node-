const db = require('../config/db');
const bcrypt = require('bcrypt');
const path = require('path');

const public_path = path.join(process.cwd(), 'public');

module.exports = {
    renderLogin: (req, res) => {
        res.sendFile(path.join(public_path, 'login.html'));
    },

    login: async (req, res) => {
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
    }
}