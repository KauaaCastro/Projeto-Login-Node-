const inputs = document.querySelectorAll('.code-input');
const btnConfirm = document.querySelector('button[name="submit"]');

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

btnConfirm.addEventListener('click', async (e) => {
    e.preventDefault();
    const fullCode = Array.from(inputs).map(i => i.value).join('');

    if(fullCode.length !== 6) {
        alert("Por favor, preencha os 6 digitos do código");
        return;
    }

    try {
        const response = await fetch ('/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({code:fullCode})
        });

        const result = await response.json();

        if(result.success) {
            alert("Código validado com sucesso! Redirecionando para a nova senha");
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
