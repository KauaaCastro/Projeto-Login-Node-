function openModal() {
    document.getElementById("modal").classList.add("active");
}

function closeModal() {
    document.getElementById("modal").classList.remove("active");
}

document.getElementById("modal").addEventListener("click", function(e) {
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