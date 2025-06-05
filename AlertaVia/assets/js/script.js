// Elementos do DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('platformModal');
const closeModal = document.querySelector('.close');
const contactForm = document.querySelector('.contact-form');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    addScrollEffects();
    handleFormSubmission();
    initializeTheme();
    initializeAdvancedSystems();
});

// Inicializar componentes
function initializeComponents() {
    // Menu mobile
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Modal
    if (closeModal && modal) {
        closeModal.addEventListener('click', closeModalWindow);
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModalWindow();
            }
        });
    }

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Inicializar sistemas avançados
    initializeAdvancedSystems();
}

// Toggle menu mobile
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animação do hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(6px, 6px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}

// Efeitos de scroll
function addScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Header shadow on scroll
        if (scrolled > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    });

    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.feature-card, .feature-item, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Função para abrir o mapa
function openMap() {
    if (notificationSystem) {
        notificationSystem.showToast({
            type: 'info',
            title: 'Mapa AlertaVia',
            message: 'Redirecionando para o mapa interativo...',
            duration: 2000
        });
    }
    
    // Redirecionar para a página do mapa após um pequeno delay
    setTimeout(() => {
        window.location.href = 'mapa.html';
    }, 500);
}

// Função para abrir funcionalidades
function openFeature(featureType) {
    if (notificationSystem) {
        const messages = {
            map: {
                type: 'info',
                title: 'Mapa Interativo',
                message: 'Redirecionando para o mapa em tempo real...',
                duration: 3000
            },
            alerts: {
                type: 'warning',
                title: 'Alertas da Comunidade',
                message: 'Carregando alertas da região...',
                duration: 3000
            },
            chat: {
                type: 'info',
                title: 'Chat Localizado',
                message: 'Conectando ao chat da comunidade...',
                duration: 3000
            }
        };
        
        if (messages[featureType]) {
            notificationSystem.showToast(messages[featureType]);
        }
    }
    
    // Simular redirecionamento
    setTimeout(() => {
        console.log(`Abrindo feature: ${featureType}`);
    }, 1000);
}

// Função para acessar plataforma
function accessPlatform() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function closeModalWindow() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Manipular envio do formulário
function handleFormSubmission() {
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.btn-submit');
            const formData = new FormData(this);
            
            try {
                // Ativar estado de loading
                if (loadingSystem) {
                    loadingSystem.setButtonLoading(submitButton, true);
                }
                
                // Simular envio
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Sucesso
                if (notificationSystem) {
                    notificationSystem.showToast({
                        type: 'success',
                        title: 'Mensagem enviada!',
                        message: 'Entraremos em contato em breve.',
                        duration: 5000
                    });
                }
                
                this.reset();
                
            } catch (error) {
                // Erro
                if (notificationSystem) {
                    notificationSystem.showToast({
                        type: 'error',
                        title: 'Erro no envio',
                        message: 'Tente novamente mais tarde.',
                        duration: 5000
                    });
                }
            } finally {
                // Desativar loading
                if (loadingSystem) {
                    loadingSystem.setButtonLoading(submitButton, false);
                }
            }
        });
    }
}

// Validar e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Fechar notificação
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Ícones para notificações
function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Cores para notificações
function getNotificationColor(type) {
    const colors = {
        'success': '#10B981',
        'error': '#EF4444',
        'warning': '#F59E0B',
        'info': '#3B82F6'
    };
    return colors[type] || colors.info;
}

// Adicionar estilos CSS para o menu mobile
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            height: calc(100vh - 80px);
            background: white;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 2rem;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .nav-menu.active {
            transform: translateX(0);
        }
        
        .nav-item {
            width: 100%;
            text-align: center;
            margin-bottom: 1rem;
        }
        
        .dropdown-content {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            box-shadow: none;
            background: #f9fafb;
            margin-top: 0.5rem;
        }
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Lazy loading para imagens
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance: Debounce para eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce aos eventos de scroll
const debouncedScrollHandler = debounce(() => {
    // Lógica de scroll com melhor performance
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Inicializar lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Analytics simples (exemplo)
function trackEvent(eventName, properties = {}) {
    // Aqui você integraria com sua ferramenta de analytics
    console.log('Evento rastreado:', eventName, properties);
}

// Rastrear cliques nos botões principais
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-map')) {
        trackEvent('click_map_button');
    } else if (e.target.matches('.btn-platform')) {
        trackEvent('click_platform_button');
    } else if (e.target.matches('.feature-card')) {
        const featureType = e.target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        trackEvent('click_feature_card', { feature: featureType });
    }
});

// Service Worker para PWA (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/assets/js/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}

// ============================================
// THEME MANAGEMENT FUNCTIONS
// ============================================

// Inicializar tema
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Se não há tema salvo, usar preferência do sistema
    const initialTheme = savedTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : savedTheme;
    
    setTheme(initialTheme);
    
    // Escutar mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme') === 'auto') {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Alternar tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Feedback visual
    showNotification(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado!`, 'info');
    
    // Animação do botão
    themeToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
}

// Aplicar tema
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Atualizar ícone
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Alternar para tema claro');
        } else {
            themeIcon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Alternar para tema escuro');
        }
    }
    
    // Atualizar meta theme-color para mobile
    updateThemeColor(theme);
}

// Atualizar cor do tema no meta tag
function updateThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = theme === 'dark' ? '#111827' : '#3B82F6';
}

// Detectar preferência de tema do sistema
function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Função para aplicar tema automaticamente baseado no horário
function autoThemeByTime() {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;
    const autoTheme = isDayTime ? 'light' : 'dark';
    
    if (localStorage.getItem('theme') === 'auto') {
        setTheme(autoTheme);
    }
}

// ===== INICIALIZAÇÃO DOS SISTEMAS AVANÇADOS ===== //
let notificationSystem, loadingSystem, progressSystem, animationSystem;

// Inicializar sistemas avançados
function initializeAdvancedSystems() {
    try {
        // Verificar se as classes estão disponíveis
        if (typeof NotificationSystem !== 'undefined') {
            notificationSystem = new NotificationSystem();
            console.log('✅ Sistema de notificações inicializado');
        }
        
        if (typeof LoadingSystem !== 'undefined') {
            loadingSystem = new LoadingSystem();
            console.log('✅ Sistema de loading inicializado');
        }
        
        if (typeof ProgressSystem !== 'undefined') {
            progressSystem = new ProgressSystem();
            console.log('✅ Sistema de progresso inicializado');
        }
        
        if (typeof AnimationSystem !== 'undefined') {
            animationSystem = new AnimationSystem();
            console.log('✅ Sistema de animações inicializado');
        }
        
        // Exemplos de uso após inicialização
        setTimeout(() => {
            if (notificationSystem) {
                notificationSystem.showToast({
                    type: 'success',
                    title: 'AlertaVia',
                    message: 'Sistema carregado com sucesso! 🚀',
                    duration: 4000
                });
            }
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao inicializar sistemas avançados:', error);
    }
}

// Função de demonstração interativa
function showDemo() {
    if (!notificationSystem) {
        console.log('Sistema de notificações não disponível');
        return;
    }
    
    // Sequência de demonstração
    let step = 0;
    const demoSteps = [
        {
            type: 'info',
            title: 'Demo AlertaVia 🚀',
            message: 'Vamos mostrar as funcionalidades principais...',
            duration: 2500
        },
        {
            type: 'warning',
            title: 'Alerta de Alagamento ⚠️',
            message: 'Alagamento detectado na Av. Boa Viagem - Evite a área!',
            duration: 3000
        },
        {
            type: 'success',
            title: 'Rota Alternativa 🛣️',
            message: 'Nova rota calculada - Economize 15 minutos!',
            duration: 3000
        },
        {
            type: 'info',
            title: 'Comunidade Ativa 👥',
            message: 'João reportou trânsito lento na BR-101',
            duration: 3000
        },
        {
            type: 'success',
            title: 'Demo Concluída ✅',
            message: 'Experimente o AlertaVia para uma mobilidade mais segura!',
            duration: 4000,
            actions: [{
                text: 'Baixar App',
                action: () => console.log('Redirecionando para download...')
            }]
        }
    ];
    
    function showNextStep() {
        if (step < demoSteps.length) {
            notificationSystem.showToast(demoSteps[step]);
            step++;
            setTimeout(showNextStep, step === 1 ? 3000 : 3500);
        }
    }
    
    showNextStep();
}

// Função para demonstrar loading em botões
function demonstrateLoading() {
    const buttons = document.querySelectorAll('.btn-map, .btn-demo');
    buttons.forEach((button, index) => {
        setTimeout(() => {
            if (loadingSystem) {
                loadingSystem.setButtonLoading(button, true);
                setTimeout(() => {
                    loadingSystem.setButtonLoading(button, false);
                }, 2000);
            }
        }, index * 500);
    });
}

// Navegação para o mapa
function navigateToMap() {
    // Verificar se estamos na página principal
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        window.location.href = 'mapa.html';
    } else {
        // Se já estamos em outra página, navegar diretamente
        window.location.href = './mapa.html';
    }
}

// Função para adicionar botão do mapa na navegação se não existir
function addMapNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !navMenu.querySelector('[href*="mapa"]')) {
        const mapNavItem = document.createElement('div');
        mapNavItem.className = 'nav-item';
        mapNavItem.innerHTML = `
            <a href="mapa.html" class="nav-link">
                <i class="fas fa-map"></i> Mapa Interativo
            </a>
        `;
        navMenu.appendChild(mapNavItem);
    }
}
