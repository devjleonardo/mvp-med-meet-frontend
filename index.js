document.addEventListener('DOMContentLoaded', function() {
    buscarContagens();
});

function buscarContagens() {
    fetch('http://127.0.0.1:5000/medicos/contagem')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-medicos').textContent = data.contagem;
        })
        .catch(error => console.error('Erro ao buscar o total de médicos:', error));

    fetch('http://127.0.0.1:5000/pacientes/contagem')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-pacientes').textContent = data.contagem;
        })
        .catch(error => console.error('Erro ao buscar o total de pacientes:', error));

    fetch('http://127.0.0.1:5000/agendamentos/hoje/contagem')
        .then(response => response.json())
        .then(data => {
            document.getElementById('agendamentos-hoje').textContent = data.contagem;
        })
        .catch(error => console.error('Erro ao buscar o total de agendamentos de hoje:', error));
}