// Elementos do DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('platformModal');
const closeModal = document.querySelector('.close');
const contactForm = document.querySelector('.contact-form');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    addScrollEffects();
    handleFormSubmission();
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
    showNotification('Redirecionando para o mapa em tempo real...', 'info');
    
    // Simular redirecionamento após um delay
    setTimeout(() => {
        // Aqui você integraria com a API do mapa real
        console.log('Abrindo mapa em tempo real');
        // window.location.href = '/mapa'; // Exemplo de redirecionamento
    }, 1500);
}

// Função para abrir funcionalidades
function openFeature(featureType) {
    const features = {
        'map': 'Abrindo Mapa em Tempo Real...',
        'alerts': 'Carregando Alertas da Comunidade...',
        'chat': 'Iniciando Chat Localizado...'
    };
    
    const message = features[featureType] || 'Carregando funcionalidade...';
    showNotification(message, 'info');
    
    setTimeout(() => {
        console.log(`Funcionalidade ${featureType} carregada`);
        // Aqui você implementaria a navegação para cada funcionalidade
    }, 1500);
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
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            // Validação básica
            if (!name || !email || !message) {
                showNotification('Por favor, preencha todos os campos!', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, insira um e-mail válido!', 'error');
                return;
            }
            
            // Simular envio
            showNotification('Enviando mensagem...', 'info');
            
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                contactForm.reset();
            }, 2000);
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
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}
