const db = require('../config/db');
const mailer = require('../config/mailer');
const bcrypt = require('bcrypt')

module.exports = {
    verifyEmail: async(req, res) => {
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
    },

    verifyCode: async(req, res) => {
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
    },

    redefPassword: async(req, res) => {
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
    }
}