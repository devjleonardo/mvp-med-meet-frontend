document.addEventListener("DOMContentLoaded", function() {
    listarMedicos();
});

function listarMedicos() {
    fetch('http://127.0.0.1:5000/medicos')
        .then(response => response.json())
        .then(medicos => {
            const container = document.getElementById('medicos-container');
            medicos.forEach(medico => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';
                card.id = `card-${medico.id}`;
                card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${medico.nome}</h5>
                        <p class="card-text"><strong>CRM:</strong> ${medico.crm}</p>
                        <p class="card-text"><strong>Especialidade:</strong> ${medico.especialidade}</p>
                        <div class="input-group">
                            <input type="date" id="data-${medico.id}" class="form-control">
                            <button onclick="visualizarAgendaMedico(${medico.id})" class="btn btn-primary" style="width: auto;" data-bs-toggle="collapse" data-bs-target="#agenda-${medico.id}">Ver Agenda</button>
                        </div>
                    </div>
                </div>
            `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Erro ao buscar médicos:', error));
}

function visualizarAgendaMedico(medicoId) {
    const dataSelecionada = document.getElementById(`data-${medicoId}`).value;

    if (!dataSelecionada) {
        alert("Por favor, selecione uma data.");
        return;
    }

    let agendaContainer = document.getElementById(`agenda-${medicoId}`);

    if (!agendaContainer) {
        agendaContainer = document.createElement('div');
        agendaContainer.id = `agenda-${medicoId}`;
        agendaContainer.className = 'collapse';
        const cardBody = document.querySelector(`#card-${medicoId} .card-body`);
        cardBody.appendChild(agendaContainer);
    }

    const url = `http://127.0.0.1:5000/medicos/agenda?medico_id=${medicoId}&data=${dataSelecionada}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(agenda => {
            agendaContainer.innerHTML = '';
            agenda.forEach((slot, index) => {
                const slotDiv = document.createElement('div');
                slotDiv.className = `time-slot ${slot.ocupado ? 'occupied' : 'available'} ${index === 0 ? 'mt-2' : ''}`;
                slotDiv.textContent = `Horário: ${slot.inicio} - ${slot.fim} - ${slot.ocupado ? 'Agendado' : 'Livre'}`;

                if (!slot.ocupado) {
                    const agendarButton = document.createElement('button');
                    agendarButton.className = 'btn btn-success btn-sm';
                    agendarButton.textContent = 'Agendar';
                    agendarButton.onclick = function() {
                        agendarConsulta(medicoId, slot.inicio, dataSelecionada);
                    };
                    slotDiv.appendChild(agendarButton);
                } else {
                    const verButton = document.createElement('button');
                    verButton.className = 'btn btn-warning btn-sm';
                    verButton.textContent = 'Ver';
                    verButton.onclick = function() {
                        verAgendamento(slot.agendamentoId);
                    };
                    slotDiv.appendChild(verButton);
                }

                agendaContainer.appendChild(slotDiv);
            });
            $(agendaContainer).collapse('toggle');
        })
        .catch(error => {
            console.error('Erro ao buscar agenda:', error);
            alert(`Erro ao buscar agenda: ${error.message}`);
        });
}

function fecharAgenda() {
    document.getElementById('calendar-container').style.display = 'none';
}

let currentMedicoId = null;

function agendarConsulta(medicoId, horarioInicio, dataSelecionada) {
    currentMedicoId = medicoId;
    const nomeMedico = document.querySelector(`#card-${medicoId} .card-title`).textContent;
    const dataFormatada = dataSelecionada;
    const horarioFormatado = horarioInicio.slice(0, 5);

    document.getElementById('nomeMedico').value = nomeMedico;
    document.getElementById('agendamentoData').value = `Data: ${dataFormatada}, Horário: ${horarioFormatado}`;

    var modal = new bootstrap.Modal(document.getElementById('agendamentoModal'), {
        keyboard: false
    });
    modal.show();
}

function confirmarAgendamento() {
    const nomePaciente = document.getElementById('nomePaciente').value;
    const nomeMedico = document.getElementById('nomeMedico').value;
    const dataHorario = document.getElementById('agendamentoData').value;

    if (!nomePaciente || !nomeMedico || !dataHorario) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const [data, horario] = dataHorario.replace("Data: ", "").split(", Horário: ");

    const agendamentoData = {
        paciente_nome: nomePaciente,
        medico_nome: nomeMedico,
        data: data.trim(),
        horario: horario.trim()
    };

    fetch('http://127.0.0.1:5000/agendamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agendamentoData)
        })
        .then(response => response.json())
        .then(data => {
            $('#agendamentoModal').modal('hide');
            visualizarAgendaMedico(currentMedicoId)
            showNotificacaoSucesso()
        })
        .catch(error => {
            console.error('Erro ao agendar consulta:', error);
            alert('Ocorreu um erro ao realizar o agendamento. Tente novamente.');
        });
}

function confirmarAgendamento() {
    const nomePaciente = document.getElementById('nomePaciente').value;
    const nomeMedico = document.getElementById('nomeMedico').value;
    const dataHorario = document.getElementById('agendamentoData').value;

    if (!nomePaciente || !nomeMedico || !dataHorario) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const [data, horario] = dataHorario.replace("Data: ", "").split(", Horário: ");

    // Criação do FormData
    const formData = new FormData();
    formData.append('paciente_nome', nomePaciente);
    formData.append('medico_nome', nomeMedico);
    formData.append('data', data.trim());
    formData.append('horario', horario.trim());

    fetch('http://127.0.0.1:5000/agendamentos', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        $('#agendamentoModal').modal('hide');
        visualizarAgendaMedico(currentMedicoId)
        showNotificacaoSucesso()
    })
    .catch(error => {
        console.error('Erro ao agendar consulta:', error);
        alert('Ocorreu um erro ao realizar o agendamento. Tente novamente.');
    });
}

$(document).ready(function() {
    $('#nomePaciente').on('input', function() {
        const nomePaciente = $(this).val();
        const autoComplete = $('#auto-complete');

        if (nomePaciente.length >= 1) {
            $.ajax({
                url: 'http://127.0.0.1:5000/pacientes/buscar',
                dataType: 'json',
                data: {
                    nome: nomePaciente
                },
                success: function(data) {
                    autoComplete.empty();

                    if (data.length > 0) {
                        autoComplete.show();
                        $.each(data, function(index, item) {
                            autoComplete.append('<li class="list-group-item">' + item.nome + '</li>');
                        });
                    } else {
                        autoComplete.hide();
                    }
                },
                error: function() {
                    autoComplete.hide();
                }
            });
        } else {
            autoComplete.hide();
        }
    });

    $(document).on('click', '#auto-complete li', function() {
        $('#nomePaciente').val($(this).text());
        $('#auto-complete').hide();
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('#nomePaciente').length) {
            $('#auto-complete').hide();
        }
    });
});


function verAgendamento(agendamentoId) {
    fetch('http://127.0.0.1:5000/agendamentos/ver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                agendamento_id: agendamentoId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                console.log(data);

                document.getElementById('nomePaciente').value = data.paciente_nome || 'Nome não encontrado';
                document.getElementById('nomeMedico').value = data.medico_nome || 'Nome não encontrado';

                const dataFormatada = new Date(data.inicio).toLocaleDateString('pt-BR');
                const horarioFormatado = new Date(data.inicio).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                document.getElementById('agendamentoData').value = `Data: ${dataFormatada}, Horário: ${horarioFormatado}`;
                var modal = new bootstrap.Modal(document.getElementById('agendamentoModal'), {
                    keyboard: false
                });
                modal.show();
            }
        })
        .catch(error => {
            console.error('Erro ao obter agendamento:', error);
            alert('Ocorreu um erro ao obter os dados do agendamento. Tente novamente.');
        });
}

function showNotificacaoSucesso() {
    const alertPlaceholder = document.createElement('div');
    alertPlaceholder.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 1050;">
            Agendamento marcado com sucesso!
        </div>
    `;

    document.body.appendChild(alertPlaceholder);

    setTimeout(() => {
        $(alertPlaceholder).find('.alert').alert('close');
    }, 2000);
}