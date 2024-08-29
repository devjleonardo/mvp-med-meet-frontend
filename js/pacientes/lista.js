document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('pacienteCadastrado') === 'true') {
        showSuccessNotification();
        localStorage.removeItem('pacienteCadastrado');
    }

    loadListagem();
});

function showSuccessNotification() {
    const alertPlaceholder = document.createElement('div');
    alertPlaceholder.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 1050;">
            Paciente cadastrado com sucesso!
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
                titulo: "Lista de Pacientes",
                textoBotaoCadastrar: "+ Cadastrar Paciente",
                cabecalhos: ["NOME", "EMAIL", "CPF", "ENDEREÇO"],
                campos: ["nome", "email", "cpf", "endereco"],
                apiEndpoint: "/pacientes",
            };

            inicializarListagem(config);
            $("#page-content").show();
            $("#botao-cadastrar").click(function() {
                window.location.href = "/pages/pacientes/cadastro.html";
            });
        }
    );
}