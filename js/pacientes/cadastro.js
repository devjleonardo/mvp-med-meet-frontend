document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formCadastroPaciente');
  form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await cadastrarPaciente();
  });
});

const cadastrarPaciente = async () => {
  console.error('Error:');

  const nome = document.getElementById('nomePaciente').value;
  const email = document.getElementById('emailPaciente').value;
  const cpf = document.getElementById('cpfPaciente').value;
  const endereco = document.getElementById('enderecoPaciente').value;

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('email', email);
  formData.append('cpf', cpf);
  formData.append('endereco', endereco);
console.log(formData)
  try {
      const response = await fetch('http://127.0.0.1:5000/pacientes', {
          method: 'POST',
          body: formData
      });
      const data = await response.json();
      if (response.ok) {
          localStorage.setItem('pacienteCadastrado', 'true');
          window.location.href = '/pages/pacientes/lista.html';
      } else {
          throw new Error(data.message || 'Erro desconhecido');
      }
  } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('email')) {
          const emailInput = document.getElementById('emailPaciente');
          const emailErrorDiv = document.getElementById('emailError');
          emailInput.classList.add('is-invalid');
          emailErrorDiv.textContent = "Esse email já está em uso.";
          emailErrorDiv.style.display = 'block';
      } else if (error.message.includes('CPF')) {
          const crmInput = document.getElementById('cpfPaciente');
          const crmErrorDiv = document.getElementById('cpfError');
          crmInput.classList.add('is-invalid');
          crmErrorDiv.textContent = "CPF já está em uso.";
          crmErrorDiv.style.display = 'block';
      } else {
          alert(error.message || 'Erro desconhecido');
      }
  }
};