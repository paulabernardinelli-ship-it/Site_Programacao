// Selene Premium - Script para Cadastro com ViaCEP
document.addEventListener('DOMContentLoaded', function() {
  const formCadastro = document.getElementById('form-cadastro');
  const cepInput = document.getElementById('cep');
  const buscarCepBtn = document.getElementById('buscar-cep');
  
  // Máscara para o CEP
  cepInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    e.target.value = value;
  });
  
  // Buscar endereço por CEP usando ViaCEP
  buscarCepBtn.addEventListener('click', buscarEnderecoPorCEP);
  cepInput.addEventListener('blur', function() {
    if (this.value.length === 9) {
      buscarEnderecoPorCEP();
    }
  });
  
  async function buscarEnderecoPorCEP() {
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      showAlert('CEP inválido. Digite um CEP com 8 dígitos.');
      return;
    }
    
    // Mostrar loading
    buscarCepBtn.innerHTML = '<span class="loading-spinner"></span> Buscando...';
    buscarCepBtn.disabled = true;
    buscarCepBtn.classList.add('loading');
    
    try {
      // Usando ViaCEP - API gratuita e confiável
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro na rede');
      }
      
      const data = await response.json();
      
      if (data.erro) {
        showAlert('CEP não encontrado. Verifique o número digitado.');
        return;
      }
      
      // Preencher os campos com os dados retornados pelo ViaCEP
      document.getElementById('logradouro').value = data.logradouro || '';
      document.getElementById('bairro').value = data.bairro || '';
      document.getElementById('cidade').value = data.localidade || '';
      document.getElementById('estado').value = data.uf || '';
      document.getElementById('complemento').value = data.complemento || '';
      
      // Adicionar classe de feedback visual para campos preenchidos
      const camposPreenchidos = ['logradouro', 'bairro', 'cidade', 'estado'];
      camposPreenchidos.forEach(campo => {
        const element = document.getElementById(campo);
        element.classList.add('auto-filled');
        setTimeout(() => element.classList.remove('auto-filled'), 2000);
      });
      
      // Focar no campo número após preencher o endereço
      document.getElementById('numero').focus();
      
      showAlert('Endereço encontrado com sucesso! Agora preencha o número.');
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      showAlert('Erro ao buscar endereço. Verifique sua conexão ou tente novamente.');
    } finally {
      // Restaurar botão
      buscarCepBtn.innerHTML = 'Buscar CEP';
      buscarCepBtn.disabled = false;
      buscarCepBtn.classList.remove('loading');
    }
  }
  
  // Validação do formulário de cadastro
  if (formCadastro) {
    formCadastro.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Coletar dados do formulário
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const idade = document.getElementById('idade').value;
      const cep = document.getElementById('cep').value;
      const logradouro = document.getElementById('logradouro').value;
      const numero = document.getElementById('numero').value;
      
      // Validação dos campos obrigatórios
      if (!nome || !email || !idade || !cep || !logradouro || !numero) {
        showAlert('Por favor, preencha todos os campos obrigatórios (*).');
        return;
      }
      
      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert('Por favor, digite um e-mail válido.');
        return;
      }
      
      // Simular envio do formulário com loading
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Salvando...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showAlert('🎉 Cadastro realizado com sucesso! Agora configure suas preferências literárias.');
        
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirecionar para página de preferências após 2 segundos
        setTimeout(() => {
          window.location.href = 'produtos.html';
        }, 2000);
      }, 1500);
    });
  }
  
  // Função para mostrar alertas
  function showAlert(msg) { 
    // Remover alertas anteriores
    const alertasAnteriores = document.querySelectorAll('.alert');
    alertasAnteriores.forEach(alerta => alerta.remove());
    
    const a = document.createElement('div'); 
    a.className = 'alert'; 
    a.textContent = msg; 
    document.body.appendChild(a); 
    setTimeout(() => a.remove(), 4500); 
  }
  
  // Validação de email em tempo real
  const emailInput = document.getElementById('email');
  emailInput.addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
      this.style.borderColor = '#e74c3c';
      showAlert('Por favor, digite um e-mail válido.');
    } else if (email) {
      this.style.borderColor = '#27ae60';
    } else {
      this.style.borderColor = '';
    }
  });
  
  // Validação de idade
  const idadeInput = document.getElementById('idade');
  idadeInput.addEventListener('blur', function() {
    const idade = parseInt(this.value);
    if (idade < 12 || idade > 120) {
      this.style.borderColor = '#e74c3c';
      showAlert('A idade deve ser entre 12 e 120 anos.');
    } else if (this.value) {
      this.style.borderColor = '#27ae60';
    } else {
      this.style.borderColor = '';
    }
  });
});
