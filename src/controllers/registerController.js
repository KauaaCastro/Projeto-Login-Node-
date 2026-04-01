const db = require('../config/db');
const bcrypt = require('bcrypt');

module.exports = {
    registerScreen: async(req, res) => {
        const {rgEmail, rgPassword, rgName} = req.body;
    },

    registerPreview: async(req, res) => {
    const { rgName, rgEmail, rgPassword } = req.body;
    
    res.render('registerPreview', {
        user: {
            name: rgName,
            email: rgEmail,
            password: rgPassword,
        }
    });
    },

    confirmRegister: async(req, res) => {
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
    }
}