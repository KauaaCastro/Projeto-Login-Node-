const db = require('../config/db');
console.log("O arquivo dashboard.js foi carregado pelo sistema!");
module.exports = {
    randerDashboard: async (req, res) => {
        try {
            if (!req.session.user) return res.redirect('/');

            const userID = req.session.user.id;
            console.log(userID);

            const [folder] = await db.query('SELECT * FROM folders WHERE user_id = ?', [userID]);

            const [purchases] = await db.query('SELECT * FROM v_expenses_details WHERE user_id = ?', [userID]);

            const [cards] =  await db.query('SELECT * FROM cards WHERE user_id = ?', [userID]);

            res.render('dashboard', {
                userName: req.session.user.name,
                pastas: folder,
                itens: purchases,
                cards: cards
            });

        } catch (error) {
            console.log("--- DEBUG DE ERRO ---");
            console.error("Mensagem do erro:", error.message);
            console.error("Código do erro:", error.code);
            console.log("----------------------");
            res.status(500).send("Erro no carregamento de dados do usuário");
        }
    },

createFolder: async(req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: "Sessão expirada. Faça login novamente." });
            }

            const folderCr = req.body.nameFolder;
            const userId = req.session.user.id; 
            const query = 'INSERT INTO folders (user_id, name) VALUES (?, ?)';
            
            await db.execute(query, [userId, folderCr]);

            return res.status(200).json({message: "Pasta criada com sucesso!"});

        } catch (error) {
            console.log("Erro ao salvar pasta:");
            console.error(error.message);
            return res.status(500).json({error: "Erro interno no servidor"});
        }
    }
}
