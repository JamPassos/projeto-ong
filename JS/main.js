(function() {
    "use strict";

    document.addEventListener('DOMContentLoaded', () => {

        const themeToggle = document.getElementById('theme-toggle');
        const htmlEl = document.documentElement;

        function updateThemeButton(theme) {
            if (themeToggle) { // Adiciona verificação se o botão existe
                if (theme === 'dark') {
                    themeToggle.setAttribute('aria-label', 'Desativar modo escuro');
                    themeToggle.setAttribute('title', 'Desativar modo escuro');
                } else {
                    themeToggle.setAttribute('aria-label', 'Ativar modo escuro');
                    themeToggle.setAttribute('title', 'Ativar modo escuro');
                }
            }
        }

        let currentTheme = htmlEl.classList.contains('dark-mode') ? 'dark' : 'light';
        updateThemeButton(currentTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                htmlEl.classList.toggle('dark-mode');

                let currentTheme = htmlEl.classList.contains('dark-mode') ? 'dark' : 'light';
                localStorage.setItem('theme', currentTheme);
                
                updateThemeButton(currentTheme);
            });
        }

        const modalAlerta = document.getElementById('modal-alerta');
        const modalTitulo = document.getElementById('modal-titulo');
        const modalMensagem = document.getElementById('modal-mensagem');
        const modalFechar = document.getElementById('modal-fechar');

        function exibirModal(mensagem, tipo = 'aviso') {
            if (modalAlerta && modalMensagem && modalTitulo) {
                modalMensagem.textContent = mensagem;
                
                modalAlerta.classList.remove('modal-sucesso');

                if (tipo === 'sucesso') {
                    modalTitulo.textContent = 'Sucesso!';
                    modalAlerta.classList.add('modal-sucesso');
                } else {
                    modalTitulo.textContent = 'Aviso';
                }
                
                modalAlerta.classList.add('ativo');
                modalAlerta.setAttribute('aria-hidden', 'false');
            }
        }

        function fecharModal() {
            if (modalAlerta) {
                modalAlerta.classList.remove('ativo');
                modalAlerta.setAttribute('aria-hidden', 'true');
            }
        }

        if (modalFechar) {
            modalFechar.addEventListener('click', fecharModal);
        }

        if (modalAlerta) {
            modalAlerta.addEventListener('click', (evento) => {
                if (evento.target === modalAlerta) {
                    fecharModal();
                }
            });
        }

        const formulario = document.querySelector('form[action="#"]');

        if (!formulario) {
            return;
        }

        formulario.setAttribute('novalidate', true);

        const campoCPF = document.getElementById('cpf');
        const campoTelefone = document.getElementById('telefone');
        const campoCEP = document.getElementById('cep');

        if (campoCPF) {
            campoCPF.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        }

        if (campoTelefone) {
            campoTelefone.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            });
        }

        if (campoCEP) {
            campoCEP.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            });
        }

        const campos = formulario.querySelectorAll('input[required]');

        campos.forEach(campo => {
            const spanErro = document.createElement('span');
            spanErro.className = 'error-message';
            campo.parentNode.insertBefore(spanErro, campo.nextSibling);
        });

        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            let formValido = true;

            campos.forEach(campo => {
                if (!validarCampo(campo)) {
                    formValido = false;
                }
            });

            if (!formValido) {
                exibirModal('Por favor, corrija os campos destacados antes de enviar.', 'aviso');
            } else {
                exibirModal('Dados enviados com sucesso! Entraremos em contato em breve.', 'sucesso');
                formulario.reset();
                campos.forEach(campo => {
                    campo.classList.remove('valido');
                });
            }
        });

        campos.forEach(campo => {
            campo.addEventListener('blur', () => {
                validarCampo(campo);
            });

            campo.addEventListener('input', () => {
                limparErro(campo);
            });
        });

        function validarCampo(campo) {
            const spanErro = campo.nextElementSibling;
            const mensagem = getMensagemErro(campo);

            if (mensagem) {
                spanErro.textContent = mensagem;
                campo.classList.add('invalido');
                campo.classList.remove('valido');
                return false;
            } else {
                spanErro.textContent = '';
                campo.classList.add('valido');
                campo.classList.remove('invalido');
                return true;
            }
        }

        function limparErro(campo) {
            const spanErro = campo.nextElementSibling;
            spanErro.textContent = '';
            campo.classList.remove('invalido');
        }

        function getMensagemErro(campo) {
            const validity = campo.validity;

            if (validity.valueMissing) {
                return 'Este campo é obrigatório.';
            }

            if (validity.typeMismatch) {
                if (campo.type === 'email') {
                    return 'Formato de e-mail inválido. Ex: seuemail@exemplo.com';
                }
            }

            if (validity.patternMismatch) {
                return campo.title || 'Formato inválido.';
            }

            if (validity.tooShort) {
                return `Deve ter no mínimo ${campo.minLength} caracteres.`;
            }

            return null;
        }

    });

})();