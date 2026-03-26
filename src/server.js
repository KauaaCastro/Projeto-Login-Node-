require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const db = require("./config/db");
const mailer = require('./config/mailer');

const public_path = path.join(__dirname, '..', 'public');
const server_port = process.env.PORT;

app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(public_path)));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(public_path, 'confirmTokken.html')); // ALTERAR POSTERIORMENTE
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

app.post('/verify-email', async (req,res) => {
    const inputEmail = req.body.emailConfirmation;

    try{
        if(!inputEmail) {
            return res.status(400).json({
                 success: false,
                message: "Por favor insira um email válido!"});

        }

        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [inputEmail]);

        if(rows.length > 0) {
            const user = rows[0];

            // Apagar após alterações
            console.log("Usuário encontrado:", user.email);

            const genCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 5 * 60 * 1000);

            await db.execute (
                'UPDATE users SET reset_code = ?, reset_expires = ? WHERE email = ?', [genCode, expires, inputEmail]
            );

            const mailOptions = {
                from: '"Sistema de Login" <noreply@seusite.com>',
                to: inputEmail,
                subject: "Seu Código de Recuperação",
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h2>Recuperação de Senha</h2>
                        <p>Olá! Você solicitou a redefinição de sua senha.</p>
                        <p>Seu código de verificação é:</p>
                        <h1 style="color: #4A90E2; letter-spacing: 5px;">${genCode}</h1>
                        <p>Este código expira em 15 minutos.</p>
                    </div>
                `
            };

            await mailer.sendMail(mailOptions);
                        // Apagar após alterações
            console.log(`e-mail enviado para ${inputEmail}`);
                        // Apagar após alterações
            console.log(`Código gerado para: ${inputEmail}:${genCode}`);

            return res.status(200).json({
                success: true,
                message: "E-mail verificado! Código gerado no banco de dados."
            })
        } else {
            console.log("E-mail não cadastrado:", inputEmail);
            return res.status(404).json({
                success: false,
                 message: "Este e-mail não está cadastrado em nosso banco de dados"});
        };
    } catch (error) {
        console.log("Ocorreu um erro ao adquirir o email, tente novamente!");
        console.log(error)
    }
});

app.post('/verify-code', async (req, res) => {
    const {code, email} = req.body;

    if (!code || !email) {
        return res.status(400).json({ 
            success: false, 
            message: "Código não enviado!" });
    }

    try{
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE reset_code = ? AND email = ? AND reset_expires > NOW()', [code, email]
    );

    if(rows.length > 0) {
        return res.status(200).json({ 
            success: true, 
            message: "Código Verificado!" });
    } else {
        return res.status(400).json({ 
            success: false, 
            message: "Código inválido ou expirado!" });
    }
  } catch (error) {
    console.log("Ocorreu um erro ao verificar o tokken", error);
    if (!res.headersSent) {
            return res.status(500).json({ 
                success: false, 
                message: "Erro interno no servidor." });
        }
    }
});

app.post('/redefPassword', async (req, res) => {
    const {email, code, newPassword, ConfirmPassword} = req.body;
    console.log("Email:", email);
    console.log("Code:", code);

    try {
        if(!email || !code || !newPassword || !ConfirmPassword){
            return res.status(400).json({
                success: false, 
                message: "Dados incompletos!"});
        }

        if(newPassword !== ConfirmPassword) {
            return res.status(400).json({
                success: false, 
                message: "Ops, uma senha está diferente da outra!"});
        }
            const hashedPsw = await bcrypt.hash(newPassword,10);

            const [result] = await db.execute(
                'UPDATE users SET password = ?, reset_code = NULL, reset_expires = NULL WHERE email = ? AND reset_code = ?',
                [hashedPsw, email, code]
            );

            if(result.affectedRows > 0) {
                return res.json({
                    success: true,
                     message: "Senha alterada com sucesso!"});
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Link Expirado!"});
            }

        } catch (error) {
        console.log("Ocorreu um erro ao salvar a nova senha");
        console.log(error);
    }
})

app.post('/register', async (req, res) => {
    const {rgEmail, rgPassword, rgName} = req.body;
});

app.post('/registerPreview', async (req, res) => {
    const { rgName, rgEmail, rgPassword } = req.body;
    
    res.render('registerPreview', {
        user: {
            name: rgName,
            email: rgEmail,
            password: rgPassword,
        }
    });
});

app.post('/confirmRegistration', async (req, res) => {
    const {finalName, finalEmail, finalPassword}= req.body;
    
    try {
        if (!finalEmail || !finalName || !finalPassword) {
            return res.status(400).json({success:false, message: "Houve um erro ao adquirir as informações, tente novamente!"});
        }
        
        const [userExist] = await db.execute(
            'SELECT id FROM users WHERE email = ? OR name = ?', 
            [finalEmail, finalName]
        );

        if(userExist.length > 0) {
            return res.status(400).send(`
                <script>
                    alert('Erro: Este e-mail ou nome de usuário já está em uso!');
                    window.history.back(); 
                </script>
            `);
        }
            
        const cryptPw = await bcrypt.hash(finalPassword, 10);
        
        
        const sqlInsert = (
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
        )

        await db.execute(sqlInsert, [finalName, finalEmail, cryptPw]);

        const [userVerify] = await db.execute(
            'SELECT id FROM users WHERE email = ?', [finalEmail]
        );

        if(userVerify.length > 0) {
            return res.send(`
            <script>
                alert('Conta criada com sucesso!');
                window.location.href = '/'; 
            </script>
            `);
        }
        
        } catch (error) {
        console.log("Ocorreu um erro ao enviar as informações ao servidor!");
        console.log(error);

        if(!res.headerSent) {
            return res.status(500).json({
                success:false, message:"Erro interno ao salvar os dados!"
            });
        }
    }
});

app.listen(server_port, () => {
    console.log("O servidor foi iniciado corretamente!");
    console.log("Servidor iniciado em: http://localhost:" + server_port);
})