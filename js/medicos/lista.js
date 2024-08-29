document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('medicoCadastrado') === 'true') {
        showSuccessNotification();
        localStorage.removeItem('medicoCadastrado');
    }

    loadListagem();
});

function showSuccessNotification() {
    const alertPlaceholder = document.createElement('div');
    alertPlaceholder.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 1050;">
            Médico cadastrado com sucesso!
        </div>
    `;

    document.body.appendChild(alertPlaceholder);

    setTimeout(() => {
        $(alertPlaceholder).find('.alert').alert('close');
    }, 2000);
}

function loadListagem() {
    $("#listagem-container").load(
        "/components/listagem.html",
        function() {
            const config = {
                titulo: "Lista de Médico(a)s",
                textoBotaoCadastrar: "+ Cadastrar Médico(a)",
                cabecalhos: ["NOME", "EMAIL", "ESPECIALIDADE", "CRM"],
                campos: ["nome", "email", "especialidade", "crm"],
                apiEndpoint: "/medicos",
            };

            inicializarListagem(config);
            $("#page-content").show();
            $("#botao-cadastrar").click(function() {
                window.location.href = "/pages/medicos/cadastro.html";
            });
        }
    );
}