document.addEventListener('DOMContentLoaded', function() {
    adicionarHorario();
    const form = document.getElementById('formCadastroMedico');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await cadastrarMedico();
    });
});

function adicionarHorario() {
    const container = document.getElementById('horariosContainer');
    const horarioDiv = document.createElement('div');
    horarioDiv.classList.add('mb-3', 'border', 'p-3', 'rounded');
    horarioDiv.innerHTML = `
        <div class="form-group mb-3">
            <label class="form-label">Dia da semana:</label>
            <select class="form-control">
              <option value="segunda-feira">Segunda-feira</option>
              <option value="terça-feira">Terça-feira</option>
              <option value="quarta-feira">Quarta-feira</option>
              <option value="quinta-feira">Quinta-feira</option>
              <option value="sexta-feira">Sexta-feira</option>
              <option value="sábado">Sábado</option>
              <option value="domingo">Domingo</option>
            </select>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="form-label">Manhã Início:</label>
                    <input type="time" class="form-control" required>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="form-label">Manhã Fim:</label>
                    <input type="time" class="form-control" required>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="form-label">Tarde Início:</label>
                    <input type="time" class="form-control" required>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label class="form-label">Tarde Fim:</label>
                    <input type="time" class="form-control" required>
                </div>
            </div>
        </div>
        <div class="text-right">
            <button class="btn btn-danger mt-3" onclick="removerHorario(this)">Remover</button>
        </div>
    `;
    container.appendChild(horarioDiv);
}

function removerHorario(button) {
    button.closest('.mb-3').remove();
}

async function cadastrarMedico() {
    const formData = new FormData();

    formData.append('nome', document.getElementById('nomeMedico').value);
    formData.append('email', document.getElementById('emailMedico').value);
    formData.append('especialidade', document.getElementById('especialidadeMedico').value);
    formData.append('crm', document.getElementById('crmMedico').value);
    formData.append('duracao_consulta', document.getElementById('duracaoConsultaMedico').value);

    try {
        const response = await fetch('http://127.0.0.1:5000/medicos', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            const medico_id = data.id;

            await cadastrarHorarios(medico_id);

            localStorage.setItem('medicoCadastrado', 'true');
            window.location.href = '/pages/medicos/lista.html';
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        handleErro(error);
    }
}

async function cadastrarHorarios(medico_id) {
    const horarios = document.querySelectorAll('#horariosContainer > div');

    for (const div of horarios) {
        const inputs = div.querySelectorAll('input[type="time"]');
        const dia_semana = div.querySelector('select').value;

        const hora_inicio_manha = inputs[0].value;
        const hora_fim_manha = inputs[1].value;
        const hora_inicio_tarde = inputs[2].value;
        const hora_fim_tarde = inputs[3].value;

        const formData = new FormData();
        formData.append('medico_id', medico_id);
        formData.append('dia_semana', dia_semana);
        formData.append('hora_inicio_manha', hora_inicio_manha);
        formData.append('hora_fim_manha', hora_fim_manha);
        formData.append('hora_inicio_tarde', hora_inicio_tarde);
        formData.append('hora_fim_tarde', hora_fim_tarde);

        try {
            const response = await fetch('http://127.0.0.1:5000/medicos/horarios', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar horário');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao cadastrar horário: ' + error.message);
        }
    }
}


function handleErro(error) {
    if (error.message.includes('email')) {
        const emailInput = document.getElementById('emailMedico');
        const emailErrorDiv = document.getElementById('emailError');
        emailInput.classList.add('is-invalid');
        emailErrorDiv.textContent = "Esse email já está em uso.";
        emailErrorDiv.style.display = 'block';
    } else if (error.message.includes('CRM')) {
        const crmInput = document.getElementById('crmMedico');
        const crmErrorDiv = document.getElementById('crmError');
        crmInput.classList.add('is-invalid');
        crmErrorDiv.textContent = "CRM já está em uso.";
        crmErrorDiv.style.display = 'block';
    } else {
        alert(error.message || 'Erro desconhecido');
    }
}