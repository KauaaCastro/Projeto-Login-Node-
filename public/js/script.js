// Verificação de email
const btnEmail = document.querySelector('button[name="emailRequest"]');
const inputEmail = document.querySelector('input[name="emailConfirmation"]');

if(btnEmail) {
    btnEmail.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log(inputEmail);

       if(!inputEmail || inputEmail.value.trim() === "") {
            alert("Por favor, insira um e-mail válido.");
            return; 
        }

        const emailValue = inputEmail.value;

        try {
            const response = await fetch('/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ emailConfirmation: emailValue})
            });

            const result = await response.json();

            if(result.success) {
                sessionStorage.setItem('userEmail', emailValue);
                alert("Código enviado! Verifique seu e-mail.");
                window.location.href='/confirmTokken.html';
                
            } else {
                alert("Erro: " + result.message);
            }
        } catch(error) {
            console.log("OCorreu um erro ao enviar o email");
            console.log(error);
        }
    })
}

// tela de Código
const inputs = document.querySelectorAll('.code-input');
const btnConfirm = document.querySelector('button[name="submit"]');

if(inputs.length > 0){    
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length > 0 && index < inputs.length - 1) {
                inputs[index + 1].focus(); 
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
}

if(btnConfirm) {
    btnConfirm.addEventListener('click', async (e) => {
        e.preventDefault();
        const fullCode = Array.from(inputs).map(i => i.value).join('');
        
        if(fullCode.length !== 6) {
            alert("Por favor, preencha os 6 digitos do código");
            return;
        }

        const userEmail = sessionStorage.getItem('userEmail');
        
        try {
            const response = await fetch ('/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code:fullCode,
                    email: userEmail
                })
            });
            
            const result = await response.json();
            
            if(result.success) {
                sessionStorage.setItem('userCode', fullCode);

                alert("Código validado com sucesso! Redirecionando para a nova senha");
                window.location.href="/redefPassword.html";
            } else {
                alert("Erro: " + result.message);
                
                inputs.forEach(i => i.value = "");
                inputs[0].focus();
            }
        } catch (error) {
            console.log("Ocorreu um erro ao tentar validar o código (script.js)");
            alert("Ocorreu um erro ao se conectar com o servidor, por favor tente novamente");
        }       
    });
}

// Redefinição de senha
const inputNewPsw = document.querySelector('input[name="newPassword"]');
const inputConfirm = document.querySelector('input[name="ConfirmPassword"]');
const btnRedef = document.querySelector('button[name="confirmRedef"]');

if (btnRedef && inputNewPsw && inputConfirm) {
    btnRedef.addEventListener('click', async (e) => {
        e.preventDefault();

        const pswValue = inputNewPsw.value;
        const confirmValue = inputConfirm.value;

        const recEmail = sessionStorage.getItem('userEmail');
        const recCode = sessionStorage.getItem('userCode');


        if (pswValue !== confirmValue) {
            alert("As senhas não coincidem!");
            window.location.href="/forgotPassword.html";
            return;
        }

        console.log(recCode, "" ,recEmail)

        if(recEmail == null || recCode == null) {
            alert("Sessão expirada. Volte e peça um novo código");
            window.location.href="/forgotPassword.html";
            return;
        }

        try {
            const response = await fetch('/redefPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: recEmail, 
                    code: recCode, 
                    newPassword: pswValue,
                    ConfirmPassword: confirmValue
                })
            });

            const result = await response.json();

            if (result.success) {

                alert("Senha alterada com sucesso! Faça login novamente.");
                sessionStorage.clear(); 
                window.location.href = '/'; 
            } else {
                alert("Erro: " + result.message);
            }
        } catch (error) {
            console.error("Erro na redefinição:", error);
            alert("Erro ao conectar com o servidor.");
        }
    });
}