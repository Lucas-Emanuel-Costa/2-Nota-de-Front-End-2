$(document).ready(function () {

    // --- Carrega mensagens da API + LocalStorage ---
    function carregarMensagens() {
        let dadosAPI = obterMensagens(); 
        let dadosLocal = JSON.parse(localStorage.getItem("mensagens")) || [];

        // Junta e evita duplicações (baseado no timestamp)
        dadosAPI.forEach(msg => {
            if (!dadosLocal.some(m => m.id === msg.id)) {
                msg.visualizada = false; 
                dadosLocal.push(msg);
            }
        });

        localStorage.setItem("mensagens", JSON.stringify(dadosLocal));
        return dadosLocal;
    }

    // --- Salva lista no localStorage ---
    function salvarMensagens(lista) {
        localStorage.setItem("mensagens", JSON.stringify(lista));
    }

    // --- Renderizar mensagens na tela ---
    function atualizarLista() {
        let lista = carregarMensagens();

        if (lista.length === 0) {
            $("#mensagens").html("<p>Nenhuma mensagem encontrada.</p>");
            return;
        }

        let html = "";
        lista.forEach(msg => {
            html += `
            <div class="card-mensagem ${msg.visualizada ? "lida" : "nao-lida"}">
                <p><strong>Nome:</strong> ${msg.nome}</p>
                <p><strong>E-mail:</strong> ${msg.email}</p>
                <p><strong>Mensagem:</strong> ${msg.mensagem}</p>

                <button class="botao-visualizar" data-id="${msg.id}">
                    Marcar como visualizada
                </button>

                <button class="botao-excluir" data-id="${msg.id}">
                    Excluir Mensagem
                </button>
            </div>`;
        });

        $("#mensagens").html(html);
    }

    // --- Evento: marcar mensagem como visualizada ---
    $(document).on("click", ".botao-visualizar", function () {
        if (!confirm("Marcar mensagem como visualizada?")) return;

        let id = $(this).data("id");
        let lista = carregarMensagens();

        lista = lista.map(msg => {
            if (msg.id === id) msg.visualizada = true;
            return msg;
        });

        salvarMensagens(lista);
        atualizarLista();
    });

    // --- Evento: excluir mensagem ---
    $(document).on("click", ".botao-excluir", function () {
        if (!confirm("Tem certeza que deseja excluir esta mensagem?")) return;

        let id = $(this).data("id");
        let lista = carregarMensagens();

        lista = lista.filter(msg => msg.id !== id);

        salvarMensagens(lista);
        atualizarLista();
    });

    // Inicializa
    atualizarLista();
});