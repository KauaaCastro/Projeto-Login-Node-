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