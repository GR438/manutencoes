// Importando as funções necessárias do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxE-IDIUmPdqDHcOU4UXM9cxL4pp4-v7w",
  authDomain: "manuten-bf0ea.firebaseapp.com",
  projectId: "manuten-bf0ea",
  storageBucket: "manuten-bf0ea.firebasestorage.app",
  messagingSenderId: "558505978208",
  appId: "1:558505978208:web:9883aa5f99b95460bd9605",
  measurementId: "G-RLKMXT0SV1"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lista de placas dos veículos
const placas = [
    "PNE6975", "PNE6925", "PNE6855", "PND9445", "PMX1039", "PMX0959", 
    "PMX0879", "OSU4375", "OSU4025", "NUX8074", "HWX4232", "HWX4222", "HWK8419"
];

// Função para inicializar placas em cada tela
function inicializarPlacas(tipo) {
    const placasDiv = document.getElementById(tipo);
    placasDiv.innerHTML = "";  // Limpa a div antes de adicionar os botões
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
                mostrarStatusPreventivaPorPlaca(placa);
            }
        };
        placasDiv.appendChild(button);
    });
}

// Função para cadastrar uma manutenção
async function cadastrarManutencao(placa) {
    const manutencaoDescricao = prompt("Cadastre a nova manutenção para " + placa);
    if (manutencaoDescricao) {
        try {
            await addDoc(collection(db, "manutencoes"), {
                placa: placa,
                descricao: manutencaoDescricao,
                dataCadastro: new Date()
            });
            alert("Manutenção cadastrada com sucesso!");
        } catch (e) {
            console.error("Erro ao cadastrar manutenção: ", e);
        }
    }
}

// Função para mostrar as manutenções de uma placa
async function mostrarManutencaoPorPlaca(placa) {
    const q = query(collection(db, "manutencoes"), where("placa", "==", placa));
    const querySnapshot = await getDocs(q);
    
    const manutencaoList = document.createElement("div");
    manutencaoList.classList.add("manutencao-list");
    
    querySnapshot.forEach((doc) => {
        const p = document.createElement("p");
        p.innerText = doc.data().descricao;
        const concluirButton = document.createElement("button");
        concluirButton.classList.add("manutencao-button");
        concluirButton.innerText = "Concluir Manutenção";
        concluirButton.onclick = async () => {
            await deleteDoc(doc.ref); // Exclui a manutenção no Firebase
            mostrarManutencaoPorPlaca(placa); // Atualiza a lista
        };
        manutencaoList.appendChild(p);
        manutencaoList.appendChild(concluirButton);
    });

    document.getElementById("placas-pendentes").innerHTML = "";
    document.getElementById("placas-pendentes").appendChild(manutencaoList);
}

// Função para cadastrar manutenção preventiva
async function cadastrarPreventiva(placa) {
    const tipoPreventiva = prompt("Qual o tipo de preventiva?");
    const dataPreventiva = prompt("Qual a data da preventiva?");
    const proximaPreventiva = prompt("Qual a próxima preventiva?");
    
    if (tipoPreventiva && dataPreventiva && proximaPreventiva) {
        try {
            await addDoc(collection(db, "preventivas"), {
                placa: placa,
                tipo: tipoPreventiva,
                data: dataPreventiva,
                proxima: proximaPreventiva,
                dataCadastro: new Date()
            });
            alert("Preventiva cadastrada com sucesso!");
        } catch (e) {
            console.error("Erro ao cadastrar preventiva: ", e);
        }
    }
}

// Função para mostrar o status das preventivas de uma placa
async function mostrarStatusPreventivaPorPlaca(placa) {
    const q = query(collection(db, "preventivas"), where("placa", "==", placa));
    const querySnapshot = await getDocs(q);
    
    const statusList = document.createElement("div");
    statusList.classList.add("status-list");
    
    querySnapshot.forEach((doc) => {
        const p = document.createElement("p");
        p.innerText = `${doc.data().tipo} - Data: ${doc.data().data} - Próxima: ${doc.data().proxima}`;
        statusList.appendChild(p);
    });

    document.getElementById("placas-status").innerHTML = "";
    document.getElementById("placas-status").appendChild(statusList);
}

// Funções para navegação entre telas
function entrarCorretiva() {
    document.getElementById("tela-inicial").style.display = "none";
    document.getElementById("tela-opcoes-corretiva").style.display = "block";
    inicializarPlacas("placas-pendentes"); // Inicializa as placas
}

function entrarPreventiva() {
    document.getElementById("tela-inicial").style.display = "none";
    document.getElementById("tela-opcoes-preventiva").style.display = "block";
    inicializarPlacas("placas-preventiva"); // Inicializa as placas
}

function voltarParaTelaInicial() {
    document.getElementById("tela-inicial").style.display = "block";
    document.getElementById("tela-opcoes-corretiva").style.display = "none";
    document.getElementById("tela-opcoes-preventiva").style.display = "none";
}

function voltarParaOpcoesCorretiva() {
    document.getElementById("tela-opcoes-corretiva").style.display = "block";
    document.getElementById("manutencao-pendentes").style.display = "none";
    document.getElementById("cadastrar-manutencao").style.display = "none";
}

function voltarParaOpcoesPreventiva() {
    document.getElementById("tela-opcoes-preventiva").style.display = "block";
    document.getElementById("cadastrar-preventiva").style.display = "none";
    document.getElementById("status-preventiva").style.display = "none";
}









