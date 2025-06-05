// AlertaVia - Sistema de Autenticação
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.apiEndpoint = '/api/auth'; // Substitua pela sua API real
        this.init();
    }

    init() {
        // Verificar se há usuário logado no localStorage
        const savedUser = localStorage.getItem('alertavia_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.updateUI();
            } catch (error) {
                localStorage.removeItem('alertavia_user');
            }
        }

        // Configurar listeners
        this.setupEventListeners();
        this.createAuthModals();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-auth="login"]')) {
                e.preventDefault();
                this.showLoginModal();
            } else if (e.target.matches('[data-auth="register"]')) {
                e.preventDefault();
                this.showRegisterModal();
            } else if (e.target.matches('[data-auth="logout"]')) {
                e.preventDefault();
                this.logout();
            }
        });
    }

    createAuthModals() {
        // Modal de Login
        const loginModal = document.createElement('div');
        loginModal.id = 'loginModal';
        loginModal.className = 'auth-modal';
        loginModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Entrar no AlertaVia</h2>
                    <button class="close-modal" data-close="loginModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="loginForm" class="auth-form">
                    <div class="form-group">
                        <label for="loginEmail">E-mail</label>
                        <input type="email" id="loginEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Senha</label>
                        <input type="password" id="loginPassword" name="password" required>
                    </div>
                    <div class="form-options">
                        <label class="checkbox">
                            <input type="checkbox" name="remember"> Lembrar-me
                        </label>
                        <a href="#" class="forgot-password">Esqueceu a senha?</a>
                    </div>
                    <button type="submit" class="btn-auth">Entrar</button>
                    <div class="auth-divider">ou</div>
                    <button type="button" class="btn-google" onclick="authManager.loginWithGoogle()">
                        <i class="fab fa-google"></i> Entrar com Google
                    </button>
                </form>
                <div class="auth-footer">
                    Não tem conta? <a href="#" data-auth="register">Registre-se aqui</a>
                </div>
            </div>
        `;

        // Modal de Registro
        const registerModal = document.createElement('div');
        registerModal.id = 'registerModal';
        registerModal.className = 'auth-modal';
        registerModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Criar Conta</h2>
                    <button class="close-modal" data-close="registerModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label for="registerName">Nome Completo</label>
                        <input type="text" id="registerName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">E-mail</label>
                        <input type="email" id="registerEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Senha</label>
                        <input type="password" id="registerPassword" name="password" required minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="registerConfirmPassword">Confirmar Senha</label>
                        <input type="password" id="registerConfirmPassword" name="confirmPassword" required>
                    </div>
                    <div class="form-options">
                        <label class="checkbox">
                            <input type="checkbox" name="terms" required> 
                            Aceito os <a href="#" target="_blank">Termos de Uso</a>
                        </label>
                    </div>
                    <button type="submit" class="btn-auth">Criar Conta</button>
                    <div class="auth-divider">ou</div>
                    <button type="button" class="btn-google" onclick="authManager.loginWithGoogle()">
                        <i class="fab fa-google"></i> Registrar com Google
                    </button>
                </form>
                <div class="auth-footer">
                    Já tem conta? <a href="#" data-auth="login">Entre aqui</a>
                </div>
            </div>
        `;

        // Adicionar estilos
        const authStyles = document.createElement('style');
        authStyles.textContent = `
            .auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }

            .auth-modal.show {
                display: flex;
            }

            .auth-modal .modal-content {
                background: var(--bg-white);
                border-radius: var(--border-radius);
                padding: 0;
                width: 90%;
                max-width: 400px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: var(--shadow-lg);
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px 24px 16px;
                border-bottom: 1px solid var(--border-color);
            }

            .modal-header h2 {
                margin: 0;
                color: var(--text-primary);
                font-size: 20px;
            }

            .close-modal {
                background: none;
                border: none;
                font-size: 18px;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
            }

            .close-modal:hover {
                background: var(--bg-light);
            }

            .auth-form {
                padding: 24px;
            }

            .form-group {
                margin-bottom: 16px;
            }

            .form-group label {
                display: block;
                margin-bottom: 4px;
                color: var(--text-primary);
                font-weight: 500;
                font-size: 14px;
            }

            .form-group input {
                width: 100%;
                padding: 12px;
                border: 2px solid var(--border-color);
                border-radius: 8px;
                font-size: 14px;
                transition: var(--transition);
                background: var(--bg-white);
                color: var(--text-primary);
            }

            .form-group input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .form-options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                font-size: 14px;
            }

            .checkbox {
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 0;
                cursor: pointer;
                color: var(--text-secondary);
            }

            .checkbox input {
                width: auto;
                margin: 0;
            }

            .forgot-password {
                color: var(--primary-color);
                text-decoration: none;
                font-size: 14px;
            }

            .forgot-password:hover {
                text-decoration: underline;
            }

            .btn-auth {
                width: 100%;
                padding: 12px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition);
                margin-bottom: 16px;
            }

            .btn-auth:hover {
                background: var(--primary-dark);
            }

            .btn-auth:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .auth-divider {
                text-align: center;
                margin: 16px 0;
                color: var(--text-secondary);
                position: relative;
            }

            .auth-divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: var(--border-color);
                z-index: 1;
            }

            .auth-divider::after {
                content: 'ou';
                background: var(--bg-white);
                padding: 0 16px;
                position: relative;
                z-index: 2;
            }

            .btn-google {
                width: 100%;
                padding: 12px;
                background: white;
                color: #333;
                border: 2px solid var(--border-color);
                border-radius: 8px;
                font-size: 14px;
                cursor: pointer;
                transition: var(--transition);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .btn-google:hover {
                background: var(--bg-light);
            }

            .auth-footer {
                text-align: center;
                padding: 16px 24px 24px;
                border-top: 1px solid var(--border-color);
                color: var(--text-secondary);
                font-size: 14px;
            }

            .auth-footer a {
                color: var(--primary-color);
                text-decoration: none;
            }

            .auth-footer a:hover {
                text-decoration: underline;
            }

            .user-menu {
                position: relative;
                display: inline-block;
            }

            .user-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: var(--primary-color);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                border: 2px solid transparent;
                transition: var(--transition);
            }

            .user-avatar:hover {
                border-color: var(--primary-color);
            }

            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--bg-white);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                min-width: 200px;
                z-index: 1000;
                display: none;
            }

            .user-dropdown.show {
                display: block;
            }

            .user-dropdown a {
                display: block;
                padding: 12px 16px;
                color: var(--text-primary);
                text-decoration: none;
                transition: var(--transition);
                border-bottom: 1px solid var(--border-color);
            }

            .user-dropdown a:last-child {
                border-bottom: none;
            }

            .user-dropdown a:hover {
                background: var(--bg-light);
            }

            .auth-buttons {
                display: flex;
                gap: 12px;
            }

            .btn-login, .btn-register {
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: var(--transition);
                text-decoration: none;
                border: none;
            }

            .btn-login {
                background: none;
                color: var(--text-primary);
                border: 2px solid var(--border-color);
            }

            .btn-login:hover {
                background: var(--bg-light);
            }

            .btn-register {
                background: var(--primary-color);
                color: white;
            }

            .btn-register:hover {
                background: var(--primary-dark);
            }
        `;

        document.head.appendChild(authStyles);
        document.body.appendChild(loginModal);
        document.body.appendChild(registerModal);

        // Configurar eventos dos modais
        this.setupModalEvents();
        this.setupFormEvents();
    }

    setupModalEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-close]')) {
                const modalId = e.target.getAttribute('data-close');
                this.closeModal(modalId);
            }

            // Fechar modal ao clicar fora
            if (e.target.matches('.auth-modal')) {
                e.target.classList.remove('show');
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.auth-modal.show').forEach(modal => {
                    modal.classList.remove('show');
                });
            }
        });
    }

    setupFormEvents() {
        // Form de Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }

        // Form de Registro
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e.target);
            });
        }
    }

    showLoginModal() {
        document.getElementById('loginModal').classList.add('show');
        document.body.classList.add('modal-open');
    }

    showRegisterModal() {
        this.closeModal('loginModal');
        document.getElementById('registerModal').classList.add('show');
        document.body.classList.add('modal-open');
    }

    closeModal(modalId) {
        if (modalId) {
            document.getElementById(modalId).classList.remove('show');
        } else {
            document.querySelectorAll('.auth-modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
        document.body.classList.remove('modal-open');
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Entrando...';
        submitBtn.disabled = true;

        try {
            // Simulação de login (substitua pela sua API)
            await this.simulateLogin(data);
            
            // Sucesso
            showNotification('Login realizado com sucesso!', 'success');
            this.closeModal('loginModal');
            
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validações
        if (data.password !== data.confirmPassword) {
            showNotification('As senhas não coincidem.', 'warning');
            return;
        }

        if (data.password.length < 6) {
            showNotification('A senha deve ter pelo menos 6 caracteres.', 'warning');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Criando conta...';
        submitBtn.disabled = true;

        try {
            // Simulação de registro (substitua pela sua API)
            await this.simulateRegister(data);
            
            // Sucesso
            showNotification('Conta criada com sucesso!', 'success');
            this.closeModal('registerModal');
            
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateLogin(data) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simular validação (substitua pela sua lógica)
        if (data.email === 'demo@alertavia.com' && data.password === 'demo123') {
            const user = {
                id: 1,
                name: 'Usuário Demo',
                email: data.email,
                avatar: null
            };

            this.setCurrentUser(user);
            trackEvent('user_login', { method: 'email' });
            return user;
        } else {
            throw new Error('E-mail ou senha incorretos.');
        }
    }

    async simulateRegister(data) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simular criação de conta
        const user = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            avatar: null
        };

        this.setCurrentUser(user);
        trackEvent('user_register', { method: 'email' });
        return user;
    }

    async loginWithGoogle() {
        try {
            // Implementar Google OAuth
            // Para demonstração, simular login
            showNotification('Funcionalidade em desenvolvimento.', 'info');
            
            // Simulação:
            // const user = await this.googleAuth();
            // this.setCurrentUser(user);
            
        } catch (error) {
            showNotification('Erro ao fazer login com Google.', 'error');
        }
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('alertavia_user', JSON.stringify(user));
        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('alertavia_user');
        this.updateUI();
        showNotification('Logout realizado com sucesso!', 'success');
        trackEvent('user_logout');
    }

    updateUI() {
        const authContainer = document.querySelector('.nav-controls');
        if (!authContainer) return;

        // Remover elementos de auth existentes
        const existingAuth = authContainer.querySelector('.auth-buttons, .user-menu');
        if (existingAuth) {
            existingAuth.remove();
        }

        if (this.currentUser) {
            // Usuário logado
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <div class="user-avatar" onclick="authManager.toggleUserDropdown()">
                    ${this.currentUser.avatar ? 
                        `<img src="${this.currentUser.avatar}" alt="${this.currentUser.name}">` :
                        this.currentUser.name.charAt(0).toUpperCase()
                    }
                </div>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#" onclick="authManager.showProfile()">
                        <i class="fas fa-user"></i> Meu Perfil
                    </a>
                    <a href="#" onclick="authManager.showSettings()">
                        <i class="fas fa-cog"></i> Configurações
                    </a>
                    <a href="#" data-auth="logout">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </a>
                </div>
            `;
            authContainer.insertBefore(userMenu, authContainer.firstChild);
        } else {
            // Usuário não logado
            const authButtons = document.createElement('div');
            authButtons.className = 'auth-buttons';
            authButtons.innerHTML = `
                <button class="btn-login" data-auth="login">Entrar</button>
                <button class="btn-register" data-auth="register">Cadastrar</button>
            `;
            authContainer.insertBefore(authButtons, authContainer.firstChild);
        }
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('show');

        // Fechar ao clicar fora
        document.addEventListener('click', function closeDropdown(e) {
            if (!e.target.closest('.user-menu')) {
                dropdown.classList.remove('show');
                document.removeEventListener('click', closeDropdown);
            }
        });
    }

    showProfile() {
        showNotification('Funcionalidade de perfil em desenvolvimento.', 'info');
        this.toggleUserDropdown();
    }

    showSettings() {
        showNotification('Funcionalidade de configurações em desenvolvimento.', 'info');
        this.toggleUserDropdown();
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Inicializar o sistema de autenticação
const authManager = new AuthManager();

// Exportar para uso global
window.authManager = authManager;
