// AlertaVia - Configurações da Aplicação
const AlertaViaConfig = {
    // ===== CONFIGURAÇÕES GERAIS ===== //
    app: {
        name: 'AlertaVia',
        version: '2.0.0',
        description: 'Mobilidade inteligente para um trânsito mais seguro',
        author: 'AlertaVia Team',
        contact: {
            email: 'contato@alertavia.com.br',
            phone: '(81) 9999-9999',
            address: 'Recife, PE - Brasil'
        }
    },

    // ===== CONFIGURAÇÕES DE API ===== //
    api: {
        baseUrl: 'https://api.alertavia.com.br',
        endpoints: {
            traffic: '/traffic',
            alerts: '/alerts',
            routes: '/routes',
            community: '/community'
        },
        timeout: 10000
    },

    // ===== CONFIGURAÇÕES DE MAPA ===== //
    map: {
        defaultCenter: {
            lat: -8.0476,
            lng: -34.8770
        },
        defaultZoom: 12,
        provider: 'openstreetmap',
        updateInterval: 30000
    },

    // ===== CONFIGURAÇÕES DE NOTIFICAÇÕES ===== //
    notifications: {
        maxToasts: 5,
        defaultDuration: 4000,
        position: 'top-right',
        enableSound: false,
        types: {
            success: {
                color: '#10B981',
                icon: 'fas fa-check-circle'
            },
            error: {
                color: '#EF4444',
                icon: 'fas fa-exclamation-circle'
            },
            warning: {
                color: '#F59E0B',
                icon: 'fas fa-exclamation-triangle'
            },
            info: {
                color: '#3B82F6',
                icon: 'fas fa-info-circle'
            }
        }
    },

    // ===== CONFIGURAÇÕES DE ANIMAÇÕES ===== //
    animations: {
        enabled: true,
        duration: {
            fast: 200,
            normal: 300,
            slow: 500
        },
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        reducedMotion: false
    },

    // ===== CONFIGURAÇÕES DE TEMA ===== //
    theme: {
        default: 'auto',
        storage: 'alertavia-theme',
        autoByTime: true,
        transitions: true
    },

    // ===== CONFIGURAÇÕES DE DESENVOLVIMENTO ===== //
    dev: {
        debug: false,
        mockData: true,
        showPerformance: false,
        enableTestMode: false
    },

    // ===== CONFIGURAÇÕES DE PERFORMANCE ===== //
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        caching: true,
        compression: true
    },

    // ===== CONFIGURAÇÕES DE ANALYTICS ===== //
    analytics: {
        enabled: false,
        provider: null,
        trackingId: null,
        events: {
            pageView: true,
            userInteraction: true,
            errors: true
        }
    },

    // ===== CONFIGURAÇÕES REGIONAIS ===== //
    localization: {
        language: 'pt-BR',
        currency: 'BRL',
        timezone: 'America/Recife',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm'
    },

    // ===== CONFIGURAÇÕES DE SEGURANÇA ===== //
    security: {
        maxLoginAttempts: 3,
        sessionTimeout: 1800000, // 30 minutos
        csrfProtection: true,
        httpsOnly: true
    }
};

// Função para obter configuração
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], AlertaViaConfig);
}

// Função para definir configuração
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, AlertaViaConfig);
    target[lastKey] = value;
}

// Exportar configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AlertaViaConfig, getConfig, setConfig };
} else {
    window.AlertaViaConfig = AlertaViaConfig;
    window.getConfig = getConfig;
    window.setConfig = setConfig;
}
