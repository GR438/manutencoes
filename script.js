// Lista de placas dos veículos
const placas = [
    "PNE6975", "PNE6925", "PNE6855", "PND9445", "PMX1039", "PMX0959", 
    "PMX0879", "OSU4375", "OSU4025", "NUX8074", "HWX4232", "HWX4222", "HWK8419"
];

// Armazenamento das manutenções
let manutencoes = JSON.parse(localStorage.getItem("manutencoes")) || {};
let preventivas = JSON.parse(localStorage.getItem("preventivas")) || {};

// Função para inicializar placas para cada tela
function inicializarPlacas(tipo) {
    const placasDiv = document.getElementById(tipo);
    placasDiv.innerHTML = "";
    placas.forEach(placa => {
        const button = document.createElement("button");
        button.innerText = placa;
        button.classList.add("placa-button");
        button.onclick = () => {
            if (tipo === "placas-pendentes") {
                mostrarManutencaoPorPlaca(placa);
            } else if (tipo === "placas-cadastro") {
                cadastrarManutencao(placa);
            } else if (tipo === "placas-preventiva") {
                cadastrarPreventiva(placa);
            } else if (tipo === "placas-status") {
                mostrarStatusPreventivaPorPlaca(placa); // Correção aqui
            }
        };
        placasDiv.appendChild(button);
    });
}

// Função para mostrar o status das preventivas de uma placa
function mostrarStatusPreventivaPorPlaca(placa) {
    const statusDiv = document.createElement("div");
    statusDiv.classList.add("preventiva-list");

    const preventivasPlaca = preventivas[placa] || [];
    preventivasPlaca.forEach((preventivaItem, index) => {
        const p = document.createElement("p");
        p.innerText = `Tipo: ${preventivaItem.tipo}, Data: ${preventivaItem.data}, Próxima: ${preventivaItem.proxima}`;
        statusDiv.appendChild(p);

        // Botão para encerrar a preventiva
        const concluirButton = document.createElement("button");
        concluirButton.classList.add("manutencao-button");
        concluirButton.innerText = "Encerrar Preventiva";
        concluirButton.onclick = () => {
            // Remove a preventiva da lista
            preventivas[placa].splice(index, 1);
            localStorage.setItem("preventivas", JSON.stringify(preventivas)); // Atualiza no localStorage

            // Atualiza a tela, mostrando as preventivas restantes
            mostrarStatusPreventivaPorPlaca(placa);
        };
        statusDiv.appendChild(concluirButton); // Corrigido para usar concluirButton
    });

    document.getElementById("placas-status").innerHTML = "";
    document.getElementById("placas-status").appendChild(statusDiv);
}

// Função para cadastrar manutenção preventiva
function cadastrarPreventiva(placa) {
    const tipoPreventiva = prompt("Qual o tipo de preventiva?");
    const dataPreventiva = prompt("Qual a data da preventiva?");
    const proximaPreventiva = prompt("Qual a próxima preventiva?");
    
    if (tipoPreventiva && dataPreventiva && proximaPreventiva) {
        if (!preventivas[placa]) {
            preventivas[placa] = [];
        }
        preventivas[placa].push({ tipo: tipoPreventiva, data: dataPreventiva, proxima: proximaPreventiva });
        localStorage.setItem("preventivas", JSON.stringify(preventivas));
        alert("Preventiva cadastrada com sucesso!");
    }
}







