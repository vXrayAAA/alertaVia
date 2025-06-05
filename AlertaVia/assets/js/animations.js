// AlertaVia - Sistema Avançado de Animações e Microinterações
class AnimationSystem {
    constructor() {
        this.observers = new Map();
        this.counters = new Map();
        this.init();
    }

    // ===== INICIALIZAÇÃO MELHORADA ===== //
    init() {
        // Verificar se as animações são suportadas
        if (!this.supportsAnimations()) {
            console.warn('Animações não suportadas neste navegador');
            return;
        }

        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupRippleEffect();
        this.setupCounterAnimations();
        this.setupParallaxEffects();
        this.setupPerformanceOptimizations();
    }

    // Verificar suporte a animações
    supportsAnimations() {
        return 'IntersectionObserver' in window && 
               'requestAnimationFrame' in window &&
               CSS.supports('transform', 'translateX(0)');
    }

    // Otimizações de performance
    setupPerformanceOptimizations() {
        // Desabilitar animações em dispositivos com low-end
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
        if (isLowEndDevice) {
            document.documentElement.style.setProperty('--animation-fast', '0.1s');
            document.documentElement.style.setProperty('--animation-normal', '0.2s');
            document.documentElement.style.setProperty('--animation-slow', '0.3s');
        }

        // Pausar animações quando a aba não está ativa
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.style.animationPlayState = 'paused';
            } else {
                document.body.style.animationPlayState = 'running';
            }
        });

        // Reduzir animações se o usuário preferir
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
        }
    }

    // Desabilitar animações para acessibilidade
    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== INTERSECTION OBSERVER ===== //
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    this.animateElement(element);
                }
            });
        }, options);

        // Observar elementos com classes de animação
        const animatedElements = document.querySelectorAll(`
            .observe-fade,
            .observe-scale,
            .observe-slide-left,
            .observe-slide-right,
            .counter,
            .progress-circle
        `);

        animatedElements.forEach(el => observer.observe(el));
        this.observers.set('intersection', observer);
    }

    animateElement(element) {
        // Adicionar classe in-view para ativar animação CSS
        element.classList.add('in-view');

        // Animações específicas baseadas na classe
        if (element.classList.contains('counter')) {
            this.animateCounter(element);
        }

        if (element.classList.contains('progress-circle')) {
            this.animateProgressCircle(element);
        }

        // Efeito cascata para elementos filhos
        const children = element.querySelectorAll('.animate-delay-100, .animate-delay-200, .animate-delay-300');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate-fade-in-up');
            }, index * 100);
        });
    }

    // ===== CONTADOR ANIMADO ===== //
    animateCounter(element) {
        const target = parseInt(element.dataset.target) || parseInt(element.textContent);
        const duration = parseInt(element.dataset.duration) || 2000;
        const suffix = element.dataset.suffix || '';
        
        if (this.counters.has(element)) return; // Já animado
        
        this.counters.set(element, true);
        element.classList.add('counting');
        
        const startTime = Date.now();
        const startValue = 0;
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para animação suave
            const easedProgress = this.easeOutQuart(progress);
            const currentValue = Math.round(startValue + (target - startValue) * easedProgress);
            
            element.textContent = currentValue.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.classList.remove('counting');
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    // ===== PROGRESS CIRCLE ===== //
    animateProgressCircle(element) {
        const percentage = parseInt(element.dataset.percentage) || 75;
        const duration = parseInt(element.dataset.duration) || 1500;
        
        const progressText = element.querySelector('.progress-text');
        const startTime = Date.now();
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeOutQuart(progress);
            const currentPercentage = Math.round(percentage * easedProgress);
            
            // Atualizar o cone gradiente
            const degrees = (currentPercentage / 100) * 360;
            element.style.background = `conic-gradient(#3B82F6 ${degrees}deg, #E5E7EB ${degrees}deg)`;
            
            // Atualizar texto
            if (progressText) {
                progressText.textContent = `${currentPercentage}%`;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        requestAnimationFrame(updateProgress);
    }

    // ===== EFEITO RIPPLE ===== //
    setupRippleEffect() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.ripple');
            if (!button) return;
            
            this.createRipple(button, e);
        });
    }

    createRipple(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // ===== SCROLL ANIMATIONS ===== //
    setupScrollAnimations() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScrollAnimations() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Header background blur
        const header = document.querySelector('.header');
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Parallax elements
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // ===== PARALLAX EFFECTS ===== //
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            element.style.willChange = 'transform';
        });
    }

    // ===== UTILITY FUNCTIONS ===== //
    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // ===== MÉTODOS PÚBLICOS ===== //
    
    // Animar elemento manualmente
    animate(element, animation, options = {}) {
        const {
            duration = 300,
            delay = 0,
            easing = 'ease-out',
            callback = null
        } = options;
        
        setTimeout(() => {
            element.style.animation = `${animation} ${duration}ms ${easing}`;
            
            if (callback) {
                setTimeout(callback, duration);
            }
        }, delay);
    }

    // Shake element (para erros)
    shake(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    // Wobble element (para atenção)
    wobble(element) {
        element.classList.add('wobble');
        setTimeout(() => {
            element.classList.remove('wobble');
        }, 800);
    }

    // Pulse element
    pulse(element, duration = 1000) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, duration);
    }

    // Bounce element
    bounce(element) {
        element.classList.add('animate-bounce-in');
        setTimeout(() => {
            element.classList.remove('animate-bounce-in');
        }, 600);
    }

    // Highlight element
    highlight(element, color = '#3B82F6') {
        const originalBoxShadow = element.style.boxShadow;
        element.style.transition = 'box-shadow 0.3s ease';
        element.style.boxShadow = `0 0 20px ${color}50`;
        
        setTimeout(() => {
            element.style.boxShadow = originalBoxShadow;
        }, 1000);
    }

    // Typewriter effect
    typewriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // Fade transition between elements
    crossFade(elementOut, elementIn, duration = 300) {
        elementOut.style.transition = `opacity ${duration}ms ease`;
        elementIn.style.transition = `opacity ${duration}ms ease`;
        
        elementOut.style.opacity = '0';
        
        setTimeout(() => {
            elementOut.style.display = 'none';
            elementIn.style.display = 'block';
            elementIn.style.opacity = '0';
            
            setTimeout(() => {
                elementIn.style.opacity = '1';
            }, 50);
        }, duration);
    }

    // Stagger animation for multiple elements
    staggerAnimation(elements, animation, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animation);
            }, index * delay);
        });
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.counters.clear();
    }
}

// Instanciar sistema de animações
window.animationSystem = new AnimationSystem();

// Adicionar CSS para animação de ripple
const rippleCSS = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .header.scrolled {
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    [data-theme="dark"] .header.scrolled {
        background: rgba(31, 41, 55, 0.9);
    }
`;

// Inserir CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Funções de conveniência globais
window.animateElement = (element, animation, options) => {
    return animationSystem.animate(element, animation, options);
};

window.shakeElement = (element) => {
    return animationSystem.shake(element);
};

window.highlightElement = (element, color) => {
    return animationSystem.highlight(element, color);
};

// Auto-aplicar animações em elementos específicos
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar classes de animação automaticamente
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle');
    heroElements.forEach((el, index) => {
        el.classList.add('observe-fade');
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.classList.add('observe-scale', 'hover-lift', 'card-animated');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    const buttons = document.querySelectorAll('.btn-map, .btn-platform');
    buttons.forEach(btn => {
        btn.classList.add('btn-animated', 'ripple', 'hover-scale');
    });
    
    // Stats counters
    const stats = document.querySelectorAll('.stat-item h3');
    stats.forEach(stat => {
        if (stat.textContent.includes('k')) {
            stat.dataset.target = stat.textContent.replace('k+', '000');
            stat.dataset.suffix = 'k+';
        } else if (stat.textContent.includes('%')) {
            stat.dataset.target = stat.textContent.replace('%', '');
            stat.dataset.suffix = '%';
        }
        stat.classList.add('counter');
    });
});
