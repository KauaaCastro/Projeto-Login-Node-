function openModal(type) {
    const modal = document.getElementById('universalModal');
    const title = document.getElementById('modalTitle');
    const instruction = document.getElementById('modalInstruction');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelButton = document.getElementById('cancelModal');
    
    const groupFolder = document.getElementById('groupFolder');
    const groupCard = document.getElementById('groupCard');
    const groupPurchase = document.getElementById('groupPurchase');
    const groupExFolder = document.getElementById('groupExFolder');
    const groupInstallments = document.getElementById('groupInstallments');

    groupFolder.style.display = 'none';
    groupCard.style.display = 'none';
    groupExFolder.style.display = 'none';
    groupPurchase.style.display = 'none';
    groupInstallments.style.display = 'none';

    document.querySelectorAll('input').forEach(input => input.value = '');

    if (type === 'folders') {
        title.innerText = "Nova Pasta";
        instruction.innerText = "Insira o nome da Pasta:";
        groupFolder.style.display = 'block';
        
        confirmBtn.onclick = createFolder; 
    } else if (type === 'cards') {
        title.innerText = "Cadastrar novo cartão";
        instruction.innerText = "Insira o nome do banco:";
        groupCard.style.display = 'block';
        
        confirmBtn.onclick = newCard; 
    } else if(type === 'exFolders') {
        title.innerText = "Excluir pasta";
        instruction.innerText = "Digite o nome da pasta que deseja excluir:"
        groupExFolder.style.display = 'block';

        confirmBtn.onclick = exFolders;
    } else if(type === 'phFolders') {
        title.innerText = "Cadastrar gastos";
        instruction.innerText = "Coloque o nome da conta ou do gasto";
        groupPurchase.style.display = 'block';

        confirmBtn.onclick = phFolders;
    } else if(type === 'installments') {
       document.getElementById('modalTitle').innerText = 'Suas Compras Parceladas';
       document.getElementById('modalInstruction').innerText = 'Acompanhe o andamento das suas faturas:';
       document.getElementById('groupInstallments').style.display = 'block';

       confirmBtn.style.display = 'none';
       cancelButton.textContent = "Fechar";
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('universalModal').style.display = 'none';

    const confirmBtn = document.getElementById('confirmBtn');
    const cancelButton = document.getElementById('cancelModal');
    if (confirmBtn) {
        confirmBtn.style.display = 'block'; 
        cancelButton.textContent = "Cancelar";
    }
}

     document.getElementById("universalModal").addEventListener("click", function(e) {
     if(e.target === this) {
         closeModal();
    }
  });

// Toggle funcional
const folderToggle = document.getElementById('folderToggle');

if (folderToggle) {
    folderToggle.addEventListener('change', function() {
        const selectedValue = this.value; 
        const selectedFolderName = this.options[this.selectedIndex].text; 
        
        const tableRows = document.querySelectorAll('.table-container tbody tr');

        tableRows.forEach(row => {
            if (row.querySelector('td[colspan]')) return;

            const rowFolderName = row.cells[4].textContent.trim();

            if (selectedValue === 'all') {
                row.style.display = ''; 
            } else if (rowFolderName === selectedFolderName) {
                row.style.display = ''; 
            } else {
                row.style.display = 'none'; 
            }
        });

        atualizarTotalVisivel();
    });
}

function atualizarTotalVisivel() {
    const tableRows = document.querySelectorAll('.table-container tbody tr');
    let novoTotal = 0;

    tableRows.forEach(row => {
        if (row.style.display !== 'none' && !row.querySelector('td[colspan]')) {
            let textValor = row.cells[1].textContent;
            
            let valorNumerico = parseFloat(
                textValor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
            );
            
            novoTotal += valorNumerico;
        }
    });

    const divTotal = document.querySelector('.total');
    if (divTotal) {
        divTotal.innerHTML = `Total de contas: R$ ${novoTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

//Criação de pastas

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

// Criação de cartão
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

//Exclusão de pastas

async function exFolders() {
    const exFolder = document.getElementById("exFolderName");
    const confirmFolder = document.getElementById("exFolderConfirm");

    if(!exFolder || !confirmFolder || exFolder.value.trim() === "" || confirmFolder.value.trim() === "") {
        alert("Preencha os campos corretamente para que possa realizar a exclusão!");
        return;
    }

    if(exFolder.value.trim() != confirmFolder.value.trim()) {
        alert("Os nomes digitados são divergentes, insira o nome da pasta e dps confirme-a repetindo o nome da pasta");
        document.getElementById("exFolderName").value = "";
        document.getElementById("exFolderConfirm").value = "";
        return;
    }

    try {
        const data = {
            exFolder: exFolder.value.trim(),
            confirmFolder: confirmFolder.value.trim(),
        }

        const response = await fetch('/excludeFolders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if(response.ok) {
            alert("Pasta excluida com sucesso");
            closeModal();
        } else {
            alert("Pasta não encontrada!");            
            document.getElementById("exFolderName").value = "";
            document.getElementById("exFolderConfirm").value = "";
        }
    } catch (error) {
        console.log("Erro: dashboardScript --> server");
        console.log("---------------------------------");
        console.log(error);
    }
}

const priceInput = document.getElementById('price');

if (priceInput) {
    priceInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); 
        let numericValue = (Number(value) / 100);
        
        e.target.value = numericValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    });

    priceInput.addEventListener('click', function(e) {
        let length = e.target.value.length;
        e.target.setSelectionRange(length, length);
    });
}

//Funcionamento da adição de produtos

async function phFolders() {
    const description = document.getElementById('phDescription').value.trim();
    const rawPrice = document.getElementById('price').value.trim(); 
    const installmentQuantity = document.getElementById("installmentQuantity").value.trim();
    const folder = document.getElementById('phFolder').value; 
    const usedCard = document.getElementById('phCard').value;   

    if (!description || !rawPrice || !folder) {
        Swal.fire('Ops!', 'Preencha Descrição, Preço e Pasta obrigatoriamente.', 'warning');
        return;
    }

    let cleanPrice = rawPrice.replace('R$', '').replaceAll('.', '').trim();
    cleanPrice = cleanPrice.replace(',', '.');

    const data = {
        description,
        price: parseFloat(cleanPrice),
        installments: parseInt(installmentQuantity) || 1,
        folderId: folder,
        cardId: usedCard || null 
    };

    if (!usedCard) {
        Swal.fire({
            title: 'Compra no Dinheiro?',
            text: "Você não selecionou um cartão. Deseja continuar como pagamento à vista/dinheiro?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#8b5cf6',
            cancelButtonColor: '#444',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Editar'
        }).then((result) => {
            if (result.isConfirmed) {
                sendPurchaseData(data);
            }
        });
    } else {
        sendPurchaseData(data);
    }
}

async function sendPurchaseData(data) {
    try {
        const response = await fetch('/savePurchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire('Sucesso!', 'Gasto cadastrado com sucesso.', 'success')
                .then(() => window.location.reload());
        } else {
            Swal.fire('Erro', result.error || 'Erro ao salvar', 'error');
        }
    } catch (error) {
        console.error("Erro no fetch:", error);
        Swal.fire('Erro Fatal', 'Não foi possível conectar ao servidor.', 'error');
    }
}

