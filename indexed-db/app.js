// Inicializando usando prefixos para suportar os browsers
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// Prefixos do objeto IDB
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange    = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

// Verifica se tem suporte
if (!window.indexedDB) {
    window.alert("Seu browser não suporta IndexedDB.")
}

// Dados para armazenar
const estoque = [
    {
        id: "P001",
        codigo_receita: "REC201234",
        nome: "Pão de gergilim"
    },
    {
        id: "P002",
        codigo_receita: "REC101294",
        nome: "Carne de hamburguer"
    },
    {
        id: "P003",
        codigo_receita: "REC301244",
        nome: "Presunto"
    }
]

var db;

// Abre uma base
var request = window.indexedDB.open("Freeburguer", 1);

// Eventos que ocorrem no banco
request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("Banco aberto com sucesso: " + db);
};

// Evento executado apenas quando existe uma versão nova do banco
// Obs: assim que aberto pela primeira vez, implanta os dados iniciais
request.onupgradeneeded = function (event) {

    console.log("Implanta os dados");
    
    var db = event.target.result;

    // keyPath diz ao indexedDB que ID será um campo único e de index
    var objectStore = db.createObjectStore("hamburgueres", {keyPath: "id" });

    // cria um index com codigo_receita, pois é um número que também queremos pesquisar, e ele é unico
    objectStore.createIndex("codigo_receita", "codigo_receita", { unique: true });

    for (var i in estoque) {
        objectStore.add(estoque[i]);
    }
}

function lerItem() {

    // Para gravar o tempo de execução
    console.time("leitura");

    // Seta o objeto que quer manipular
    var objectStore = db.transaction(["hamburgueres"]).objectStore("hamburgueres");

    // Pesquisa pelo objeto "ID"
    var request = objectStore.get("P003");

    // Eventos que ocorrem em "request"
    request.onerror = function (event) {
        alert("Não foi possível recuperar os dados");
    };

    request.onsuccess = function (event) {
        
        // Faz algo com o resultado
        if (request.result) {

            // Para o log de execução
            console.timeEnd("leitura");

            // Imprime os dados encontrados
            alert("Nome: " + request.result.nome);
        }

        else {
            alert("Não encontramos o que você procura no banco");
        }
    };
}

function lerTodos() {

    // Seta o objeto que deseja manipular
    var objectStore = db.transaction("hamburgueres").objectStore("hamburgueres");

    // Vai iterando os itens armazenados
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            alert(cursor.key + ": " + cursor.value.nome);
            cursor.continue();
        }
        else {
            alert("Sem mais entradas!");
        }
    };
}

function buscarCodigo(codigo){

    console.time("Teste1");
    console.profile("buscarCodigo()");

    var transaction = db.transaction('hamburgueres', "readonly");
    var store = transaction.objectStore('hamburgueres');
    var index = store.index("codigo_receita");

    //filtra os contatos que tenham o idade maior ou igual a 20 e menor ou igual a 25
    var filtro = IDBKeyRange.only('REC101294');

    var request = index.openCursor(filtro);
    request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log(cursor.value);
            console.timeEnd("Teste1");
            console.profileEnd();
            cursor.continue();

        }
    }
}

function adicionar() {

    var itemAdd = {
        id: "P004",
        codigo_receita: "REC201339",
        nome: "Pão integral de hamburguer"
    };

    // Abre uma transação para adicionar
    var request = db.transaction(["hamburgueres"], "readwrite")
                    .objectStore("hamburgueres")
                    .add(itemAdd);

    // Eventos que ocorrem no "request"
    request.onsuccess = function (event) {
        alert("Item adicionado!");
    };

    request.onerror = function (event) {
        alert("Não é possível adicionar o item, já existe!");
    }
}

function remover() {

    // Abre uma transação de remoção
    var request = db.transaction(["hamburgueres"], "readwrite")
                    .objectStore("hamburgueres")
                    .delete("P004");

    // Eventos que ocorrem em "request"
    request.onsuccess = function (event) {
        alert("Item removido do banco de dados!");
    };
}