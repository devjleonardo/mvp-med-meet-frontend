$(function() {
    function inicializarListagem(config) {
        $("#titulo-listagem").text(config.titulo);
        $("#botao-cadastrar").text(config.textoBotaoCadastrar);

        const cabecalhoTabela = $("#cabecalho-tabela");
        cabecalhoTabela.empty();
        config.cabecalhos.forEach((cabecalho) => {
            cabecalhoTabela.append(`<th>${cabecalho}</th>`);
        });

        let dadosCarregados = [];

        function preencherTabela(dados) {
            const tabela = $("#corpo-tabela");
            tabela.empty();

            dados.forEach((item) => {
                let linha = "<tr>";
                config.campos.forEach((campo) => {
                    linha += `<td>${item[campo]}</td>`;
                });
                linha += "</tr>";
                tabela.append(linha);
            });

            atualizarInfoRegistros(dados.length);
        }

        function atualizarInfoRegistros(count) {
            $("#info-registros").text(`Mostrando ${count} registros`);
        }

        $.ajax({
            url: "http://localhost:5000" + config.apiEndpoint,
            method: "GET",
            success: function(response) {
                dadosCarregados = response;
                preencherTabela(dadosCarregados);
            },
            error: function(error) {
                console.error("Erro ao buscar dados da API:", error);
            }
        });

        $("#pesquisar").on("input", function() {
            const filtro = $(this).val().toLowerCase();
            const dadosFiltrados = dadosCarregados.filter((item) => {
                return config.campos.some((campo) => item[campo].toLowerCase().includes(filtro));
            });
            preencherTabela(dadosFiltrados);
        });
    }

    window.inicializarListagem = inicializarListagem;
});
