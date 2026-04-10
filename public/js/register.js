
// Tela de registro de Usuário
const rgName = document.querySelector('input[name="rgName"]');
const rgEmail = document.querySelector('input[name="rgEmail"]');
const btnRg = document.querySelector('button[name="btn_rgConfirm"]');

const firstPw = document.querySelector('input[name="rgPassword"]');
const ConfirmPw = document.querySelector('input[name="rgConfirmPw"]');

const form = document.querySelector('form');

if (btnRg) {
    btnRg.addEventListener('click', async (e) => {
        e.preventDefault(); 

        if (!rgName.value || !rgEmail.value || !firstPw.value || !ConfirmPw.value) {
            alert("Por favor preencha todos os campos obrigatórios antes de prosseguir!");
            return; 
        }

        if(firstPw.value.length < 8) {
            alert("As senhas precisam ter no mínimo 8 digitos!");
            return;
        }

        if (firstPw.value !== ConfirmPw.value) {
            alert("As senhas não coincidem, por favor tente novamente!");
            return; 
        }

        try {
            console.log("Dados validados! Indo para a tela de conferência...");
            
            form.action = '/registerPreview';
            form.method = 'POST';
            form.submit(); 

        } catch (error) {
            console.error("Erro ao redirecionar:", error);
            alert("Erro ao processar o registro, tente novamente!");
        }
    });
}