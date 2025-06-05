// AlertaVia - Sistema Avançado de Notificações e Loading
class NotificationSystem {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    init() {
        // Criar container de toasts
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    // Mostrar notificação toast
    showToast(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000,
            persistent = false,
            actions = []
        } = options;

        const toastId = this.generateId();
        const toast = this.createToast(toastId, type, title, message, persistent, actions);
        
        this.container.appendChild(toast);
        this.toasts.set(toastId, toast);

        // Animação de entrada
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto-remover se não for persistente
        if (!persistent && duration > 0) {
            setTimeout(() => {
                this.hideToast(toastId);
            }, duration);
        }

        return toastId;
    }

    createToast(id, type, title, message, persistent, actions) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.dataset.toastId = id;

        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-times',
            warning: 'fas fa-exclamation',
            info: 'fas fa-info'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
                ${actions.length > 0 ? this.createToastActions(actions) : ''}
            </div>
            ${!persistent ? `
                <button class="toast-close" onclick="notificationSystem.hideToast('${id}')">
                    <i class="fas fa-times"></i>
                </button>
            ` : ''}
        `;

        return toast;
    }

    createToastActions(actions) {
        return `
            <div class="toast-actions" style="margin-top: 8px; display: flex; gap: 8px;">
                ${actions.map(action => `
                    <button 
                        class="toast-action-btn" 
                        onclick="${action.callback}"
                        style="
                            background: rgba(59, 130, 246, 0.1);
                            border: 1px solid #3B82F6;
                            color: #3B82F6;
                            padding: 4px 12px;
                            border-radius: 6px;
                            font-size: 12px;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        "
                    >${action.text}</button>
                `).join('')}
            </div>
        `;
    }

    hideToast(toastId) {
        const toast = this.toasts.get(toastId);
        if (toast) {
            toast.classList.add('hide');
            toast.classList.remove('show');
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.toasts.delete(toastId);
            }, 300);
        }
    }

    // Métodos de conveniência
    success(title, message, options = {}) {
        return this.showToast({ type: 'success', title, message, ...options });
    }

    error(title, message, options = {}) {
        return this.showToast({ type: 'error', title, message, ...options });
    }

    warning(title, message, options = {}) {
        return this.showToast({ type: 'warning', title, message, ...options });
    }

    info(title, message, options = {}) {
        return this.showToast({ type: 'info', title, message, ...options });
    }

    generateId() {
        return 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    clearAll() {
        this.toasts.forEach((toast, id) => {
            this.hideToast(id);
        });
    }
}

// Sistema de Loading
class LoadingSystem {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Criar overlay de loading
        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">Carregando...</div>
            </div>
        `;
        document.body.appendChild(this.overlay);
    }

    show(text = 'Carregando...') {
        const textElement = this.overlay.querySelector('.loading-text');
        textElement.textContent = text;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Loading para botões específicos
    showButtonLoading(button, text = '') {
        if (button.classList.contains('btn-loading')) return;
        
        const originalText = button.innerHTML;
        button.dataset.originalText = originalText;
        button.classList.add('btn-loading');
        
        button.innerHTML = `
            <span class="btn-spinner"></span>
            <span class="btn-text">${text || 'Carregando...'}</span>
        `;
        
        button.disabled = true;
    }

    hideButtonLoading(button) {
        if (!button.classList.contains('btn-loading')) return;
        
        button.classList.remove('btn-loading');
        button.innerHTML = button.dataset.originalText || button.innerHTML;
        button.disabled = false;
        delete button.dataset.originalText;
    }
}

// Sistema de Progress Bar
class ProgressSystem {
    createProgressBar(container, initialValue = 0) {
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${initialValue}%`;
        
        progressWrapper.appendChild(progressFill);
        container.appendChild(progressWrapper);
        
        return {
            update: (value) => {
                progressFill.style.width = `${Math.min(Math.max(value, 0), 100)}%`;
            },
            complete: () => {
                progressFill.style.width = '100%';
                setTimeout(() => {
                    progressWrapper.style.opacity = '0';
                    setTimeout(() => {
                        if (progressWrapper.parentNode) {
                            progressWrapper.parentNode.removeChild(progressWrapper);
                        }
                    }, 300);
                }, 500);
            }
        };
    }
}

// Utilitários de Feedback
class FeedbackUtils {
    // Skeleton loading para elementos
    static showSkeleton(element) {
        const originalContent = element.innerHTML;
        element.dataset.originalContent = originalContent;
        
        const skeletonHtml = `
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 80%;"></div>
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
        `;
        
        element.innerHTML = skeletonHtml;
        element.classList.add('skeleton-container');
    }

    static hideSkeleton(element) {
        if (element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            delete element.dataset.originalContent;
        }
        element.classList.remove('skeleton-container');
    }

    // Animações de pulse
    static pulse(element, duration = 1000) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, duration);
    }

    // Bounce animation
    static bounce(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'bounce 0.6s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    // Loading dots
    static createDotsLoading() {
        const container = document.createElement('div');
        container.className = 'dots-loading';
        container.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        return container;
    }
}

// Instanciar sistemas globais
window.notificationSystem = new NotificationSystem();
window.loadingSystem = new LoadingSystem();
window.progressSystem = new ProgressSystem();

// Event listeners para demonstração
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar botões de teste em desenvolvimento
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        addDevelopmentControls();
    }
});

function addDevelopmentControls() {
    const devPanel = document.createElement('div');
    devPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 12px;
        max-width: 200px;
    `;
    
    devPanel.innerHTML = `
        <strong>Testes AlertaVia</strong>
        <button onclick="testSuccessToast()" style="padding: 4px 8px; font-size: 11px;">✅ Success</button>
        <button onclick="testErrorToast()" style="padding: 4px 8px; font-size: 11px;">❌ Error</button>
        <button onclick="testWarningToast()" style="padding: 4px 8px; font-size: 11px;">⚠️ Warning</button>
        <button onclick="testLoadingModal()" style="padding: 4px 8px; font-size: 11px;">🔄 Loading</button>
    `;
    
    document.body.appendChild(devPanel);
}

// Funções de teste
function testSuccessToast() {
    notificationSystem.success('Sucesso!', 'Rota segura encontrada com sucesso');
}

function testErrorToast() {
    notificationSystem.error('Erro!', 'Não foi possível calcular a rota');
}

function testWarningToast() {
    notificationSystem.warning('Atenção!', 'Alagamento detectado na sua rota');
}

function testLoadingModal() {
    loadingSystem.show('Calculando melhor rota...');
    setTimeout(() => {
        loadingSystem.hide();
        notificationSystem.success('Concluído!', 'Rota alternativa encontrada');
    }, 3000);
}

// Integração com sistema existente
window.showNotification = function(message, type = 'info') {
    const typeMap = {
        'success': 'success',
        'error': 'error',
        'warning': 'warning',
        'info': 'info'
    };
    
    notificationSystem.showToast({
        type: typeMap[type] || 'info',
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message: message
    });
};
