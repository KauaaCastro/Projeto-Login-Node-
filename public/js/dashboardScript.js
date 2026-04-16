function openModal(type) {
    const modal = document.getElementById('universalModal');
    const title = document.getElementById('modalTitle');
    const instruction = document.getElementById('modalInstruction');
    const confirmBtn = document.getElementById('confirmBtn');
    
    const groupFolder = document.getElementById('groupFolder');
    const groupCard = document.getElementById('groupCard');

    groupFolder.style.display = 'none';
    groupCard.style.display = 'none';
    document.querySelectorAll('input').forEach(input => input.value = '');

    if (type === 'folders') {
        title.innerText = "Nova Pasta";
        instruction.innerText = "Insira o nome da Pasta:";
        groupFolder.style.display = 'block';
        
        confirmBtn.onclick = createFolder; 
    } 
    
    if (type === 'cards') {
        title.innerText = "Cadastrar novo cartão";
        instruction.innerText = "Insira o nome do cartão:";
        groupCard.style.display = 'block';
        
        confirmBtn.onclick = newCard; 
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('universalModal').style.display = 'none';
}

document.getElementById("universalModal").addEventListener("click", function(e) {
    if(e.target === this) {
        closeModal();
    }
});

async function createFolder() {
    const nameFolder = document.getElementById("nameFolder");

    if (!nameFolder || nameFolder.value.trim() === "") {
        alert("Por favor, insira um nome válido!");
        return; 
    }

    const data = {
        nameFolder: nameFolder.value.trim()
    };

    console.log("Enviando dados:", data); 

    try {
        const response = await fetch('/createFolder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Pasta criada com sucesso!");
            window.location.reload();
            closeModal(); 
        } else {
            const errorData = await response.json();
            alert("Erro do servidor: " + (errorData.error || "Erro desconhecido"));
        }
    } catch (error) {
        console.error("Erro na comunicação com o servidor:", error);
        alert("Não foi possível conectar ao servidor.");
    }
}


async function newCard() {
    const cardBank = document.getElementById("cardBank");
    const closeDate = document.getElementById("closeDate");
    const endDate = document.getElementById("endDate");
    const cardName = document.getElementById("cardName");

    if(!cardName || cardName.value.trim() === "") {
        alert("Para cadastrar um cartão é necessário inserir um nome à ele!");
        return;
    } 
    
    if (!cardBank || cardBank.value.trim() === "") {
        alert("Para cadastrar cartão é necessário inserir o nome do banco");
        return;
    } 
    
    if(!endDate || endDate.value.trim() === "") {
        alert("Caso cadastre o cartão sem a data de vencimento perderá acesso à algumas funções!");
        return;
    }

    const data = {
        cardBank: cardBank.value.trim(),
        closeDate: closeDate.value.trim(),
        endDate: endDate.value.trim(),
        cardName: cardName.value.trim(),
    };

    console.log("Enviando dados: ", data);

    try {
        const response = await fetch('/createCard', {
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(data) 
        });

        if(response.ok) {
            alert("Cartão cadastrado com sucesso!");
            window.location.reload();
            closeModal();
        }
    } catch (error) {
        console.log("erro: dados do cartão --> Servidor");
        console.log("---------------------------------");
        console.log(error);

        alert("Não foi possível concluir o envio dos dados ao servidor, tente novamente!");
    }
}