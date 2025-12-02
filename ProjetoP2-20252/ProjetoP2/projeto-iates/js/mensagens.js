$(document).ready(function () {

    // --- Carrega mensagens só do localStorage ---
    function carregarMensagensLocal() {
        return JSON.parse(localStorage.getItem("mensagens")) || [];
    }

    // --- Carrega mensagens da API + mescla com LocalStorage ---
    function carregarMensagens() {
        let dadosAPI = obterMensagens() || []; // garantir array
        let dadosLocal = carregarMensagensLocal();

        // Junta e evita duplicações (baseado no id)
        dadosAPI.forEach(msg => {
            if (!dadosLocal.some(m => String(m.id) === String(msg.id))) {
                msg.visualizada = msg.visualizada ?? false; 
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
        // Se quiser buscar da API só no início, use carregarMensagensLocal()
        // Se quiser sempre sincronizar com a API, use carregarMensagens()
        let lista = carregarMensagensLocal();

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

        // Garante que estamos comparando string com string
        let id = String($(this).data("id"));
        let lista = carregarMensagensLocal();

        lista = lista.map(msg => {
            if (String(msg.id) === id) {
                msg.visualizada = true;
            }
            return msg;
        });

        salvarMensagens(lista);
        atualizarLista();
    });

    // --- Evento: excluir mensagem ---
    $(document).on("click", ".botao-excluir", function () {
        if (!confirm("Tem certeza que deseja excluir esta mensagem?")) return;

        let id = String($(this).data("id"));
        let lista = carregarMensagensLocal();

        lista = lista.filter(msg => String(msg.id) !== id);

        salvarMensagens(lista);
        atualizarLista();
    });

    // Inicializa: aqui sim sincroniza com a API na primeira vez
    carregarMensagens();
    atualizarLista();
});
