// AlertaVia - API Integration Service
// Serviço de integração com APIs externas para dados em tempo real

class APIService {
    constructor() {
        this.baseURL = 'https://api.alertavia.com.br'; // URL fictícia para demonstração
        this.weatherAPI = 'https://api.openweathermap.org/data/2.5';
        this.geocodingAPI = 'https://nominatim.openstreetmap.org';
        this.routingAPI = 'https://router.project-osrm.org/route/v1/driving';
        this.apiKey = 'demo_key'; // Em produção, usar variáveis de ambiente
        this.openWeatherKey = '5510050e124d6560394b8ae0574dbfdc'; 
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
        this.serverStatus = 'online';
        this.init();
    }

    init() {
        this.checkServerStatus();
        // Verificar status a cada 30 segundos
        setInterval(() => this.checkServerStatus(), 30000);
    }    async checkServerStatus() {
        console.log('📡 Verificando status do servidor...');
        
        try {
            // Simular uma verificação de conectividade mais robusta
            const testEndpoints = [
                'https://httpbin.org/status/200',
                this.geocodingAPI,
                'https://api.github.com'
            ];
            
            let successCount = 0;
            const promises = testEndpoints.map(async (url) => {
                try {
                    const response = await fetch(url, { 
                        method: 'HEAD',
                        mode: 'no-cors', // Para evitar CORS em demonstração
                        timeout: 3000
                    });
                    return true;
                } catch {
                    return false;
                }
            });

            const results = await Promise.allSettled(promises);
            successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;

            // Determinar status baseado nos resultados
            if (successCount >= 2) {
                this.serverStatus = 'online';
            } else if (successCount >= 1) {
                this.serverStatus = 'degraded';
            } else {
                this.serverStatus = 'offline';
            }

        } catch (error) {
            console.warn('⚠️ Erro na verificação de status, assumindo offline:', error);
            this.serverStatus = 'offline';
        }
        
        console.log(`📡 Status determinado: ${this.serverStatus}`);
        
        // Emitir evento de mudança de status
        document.dispatchEvent(new CustomEvent('server-status-change', {
            detail: { status: this.serverStatus }
        }));
    }

    // Método genérico para requisições HTTP
    async makeRequest(url, options = {}) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'AlertaVia/1.0',
                    ...options.headers
                },
                signal: controller.signal,
                ...options
            });

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            
            // Fallback para dados locais se disponível
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - verifique sua conexão');
            }
            
            throw error;
        }
    }

    // Cache management
    getCached(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCached(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Dados meteorológicos para Recife
    async getWeatherData() {
        const cacheKey = 'weather_recife';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            // Simulação de dados meteorológicos reais
            // Em produção, usar: await this.makeRequest(`${this.weatherAPI}/weather?q=Recife,BR&appid=${this.apiKey}&units=metric&lang=pt_br`)
            const weatherData = {
                temperature: Math.round(24 + Math.random() * 8), // 24-32°C
                humidity: Math.round(70 + Math.random() * 20), // 70-90%
                condition: this.getRandomWeatherCondition(),
                windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
                pressure: Math.round(1010 + Math.random() * 20), // 1010-1030 hPa
                visibility: Math.round(8 + Math.random() * 7), // 8-15 km
                uvIndex: Math.round(1 + Math.random() * 10), // 1-11
                cloudCover: Math.round(Math.random() * 100), // 0-100%
                rainProbability: Math.round(Math.random() * 100), // 0-100%
                lastUpdated: new Date().toISOString()
            };

            this.setCached(cacheKey, weatherData);
            return weatherData;
        } catch (error) {
            console.error('Weather API Error:', error);
            // Fallback data
            return {
                temperature: 28,
                humidity: 85,
                condition: 'Parcialmente nublado',
                icon: 'fas fa-cloud',
                error: true
            };
        }
    }

    getRandomWeatherCondition() {
        const conditions = [
            { condition: 'Ensolarado', icon: 'fas fa-sun' },
            { condition: 'Parcialmente nublado', icon: 'fas fa-cloud-sun' },
            { condition: 'Nublado', icon: 'fas fa-cloud' },
            { condition: 'Chuva leve', icon: 'fas fa-cloud-rain' },
            { condition: 'Chuva moderada', icon: 'fas fa-cloud-showers-heavy' },
            { condition: 'Tempestade', icon: 'fas fa-bolt' }
        ];
        
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    // Dados de trânsito em tempo real
    async getTrafficData() {
        const cacheKey = 'traffic_recife';
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            // Simulação de dados de trânsito
            const trafficData = {
                incidents: await this.generateTrafficIncidents(),
                congestionLevel: this.getRandomCongestionLevel(),
                averageSpeed: Math.round(25 + Math.random() * 20), // 25-45 km/h
                lastUpdated: new Date().toISOString()
            };

            this.setCached(cacheKey, trafficData);
            return trafficData;
        } catch (error) {
            console.error('Traffic API Error:', error);
            return { incidents: [], congestionLevel: 'medium', error: true };
        }
    }

    async generateTrafficIncidents() {
        const possibleIncidents = [
            {
                type: 'traffic',
                location: 'Av. Boa Viagem',
                coordinates: [-8.0476, -34.8770],
                severity: 'high',
                description: 'Trânsito intenso devido ao horário de pico',
                estimatedDelay: '15-25 min'
            },
            {
                type: 'accident',
                location: 'BR-101 Norte',
                coordinates: [-8.0430, -34.8700],
                severity: 'medium',
                description: 'Acidente na faixa da esquerda',
                estimatedDelay: '10-15 min'
            },
            {
                type: 'roadworks',
                location: 'Av. Conde da Boa Vista',
                coordinates: [-8.0320, -34.8900],
                severity: 'low',
                description: 'Obras de manutenção - faixa interditada',
                estimatedDelay: '5-10 min'
            },
            {
                type: 'floods',
                location: 'Rua da Aurora',
                coordinates: [-8.0520, -34.8820],
                severity: 'high',
                description: 'Alagamento devido à chuva forte',
                estimatedDelay: '20-30 min'
            },
            {
                type: 'traffic',
                location: 'Av. Agamenon Magalhães',
                coordinates: [-8.0234, -34.8943],
                severity: 'medium',
                description: 'Congestionamento na via expressa',
                estimatedDelay: '12-18 min'
            },
            {
                type: 'floods',
                location: 'Av. Caxangá',
                coordinates: [-8.0123, -34.8890],
                severity: 'medium',
                description: 'Pontos de alagamento isolados',
                estimatedDelay: '8-15 min'
            }
        ];

        // Retorna 2-4 incidentes aleatórios
        const numberOfIncidents = 2 + Math.floor(Math.random() * 3);
        const shuffled = possibleIncidents.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numberOfIncidents).map(incident => ({
            ...incident,
            id: this.generateIncidentId(),
            timestamp: new Date().toISOString(),
            confirmations: Math.floor(Math.random() * 50) + 1,
            reportedBy: 'user'
        }));
    }

    getRandomCongestionLevel() {
        const levels = ['low', 'medium', 'high'];
        return levels[Math.floor(Math.random() * levels.length)];
    }

    generateIncidentId() {
        return 'inc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Envio de relatórios de usuário
    async submitUserReport(reportData) {
        try {
            // Simulação de envio para API
            const response = {
                id: this.generateIncidentId(),
                status: 'received',
                message: 'Relatório enviado com sucesso',
                timestamp: new Date().toISOString(),
                estimatedProcessingTime: '2-5 minutos'
            };

            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Adicionar à lista local de incidentes para feedback imediato
            this.addLocalIncident(reportData);

            return response;
        } catch (error) {
            console.error('Report submission error:', error);
            throw new Error('Falha ao enviar relatório. Tente novamente.');
        }
    }

    addLocalIncident(reportData) {
        // Adiciona incidente localmente para feedback imediato
        const incident = {
            id: this.generateIncidentId(),
            type: reportData.type,
            location: reportData.location,
            coordinates: reportData.coordinates,
            description: reportData.description,
            severity: reportData.severity,
            timestamp: new Date().toISOString(),
            confirmations: 1,
            reportedBy: 'current_user',
            status: 'pending_verification'
        };

        // Disparar evento customizado para atualizar o mapa
        window.dispatchEvent(new CustomEvent('newIncidentAdded', {
            detail: incident
        }));
    }

    // Buscar rotas alternativas
    async getAlternativeRoutes(from, to) {
        try {
            // Simulação de cálculo de rotas
            const routes = [
                {
                    id: 'route_1',
                    name: 'Rota Principal',
                    distance: '8.5 km',
                    duration: '25 min',
                    traffic_level: 'medium',
                    incidents: 2,
                    recommended: false
                },
                {
                    id: 'route_2',
                    name: 'Rota Alternativa 1',
                    distance: '9.2 km',
                    duration: '18 min',
                    traffic_level: 'low',
                    incidents: 0,
                    recommended: true
                },
                {
                    id: 'route_3',
                    name: 'Rota Alternativa 2',
                    distance: '10.1 km',
                    duration: '22 min',
                    traffic_level: 'low',
                    incidents: 1,
                    recommended: false
                }
            ];

            return routes;
        } catch (error) {
            console.error('Routes API Error:', error);
            return [];
        }
    }

    // Geocoding - converter endereço em coordenadas
    async geocode(address) {
        try {
            // Simulação de geocoding para endereços conhecidos de Recife
            const knownAddresses = {
                'boa viagem': { lat: -8.0476, lng: -34.8770, display_name: 'Boa Viagem, Recife - PE' },
                'recife antigo': { lat: -8.0628, lng: -34.8711, display_name: 'Recife Antigo, Recife - PE' },
                'derby': { lat: -8.0478, lng: -34.8842, display_name: 'Derby, Recife - PE' },
                'torre': { lat: -8.0234, lng: -34.8943, display_name: 'Torre, Recife - PE' },
                'casa amarela': { lat: -8.0123, lng: -34.8890, display_name: 'Casa Amarela, Recife - PE' },
                'aflitos': { lat: -8.0567, lng: -34.8823, display_name: 'Aflitos, Recife - PE' },
                'shopping recife': { lat: -8.0476, lng: -34.8770, display_name: 'Shopping Recife, Boa Viagem - PE' },
                'marco zero': { lat: -8.0628, lng: -34.8711, display_name: 'Marco Zero, Recife Antigo - PE' },
                'aeroporto': { lat: -8.1265, lng: -34.9253, display_name: 'Aeroporto Internacional do Recife - PE' }
            };

            const normalized = address.toLowerCase().trim();
            const result = knownAddresses[normalized];

            if (result) {
                return result;
            } else {
                throw new Error('Endereço não encontrado');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            throw error;
        }
    }

    // Verificar status do servidor
    async getServerStatus() {
        try {
            const status = {
                api: 'online',
                database: 'online',
                traffic_feed: 'online',
                weather_feed: 'online',
                response_time: Math.round(50 + Math.random() * 100) + 'ms',
                last_check: new Date().toISOString()
            };

            return status;
        } catch (error) {
            return {
                api: 'offline',
                error: error.message,
                last_check: new Date().toISOString()
            };
        }
    }

    // Sistema de notificações
    async registerForNotifications(userId, preferences) {
        try {
            const registration = {
                user_id: userId,
                preferences: preferences,
                timestamp: new Date().toISOString(),
                status: 'active'
            };

            // Simular registro
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: true,
                message: 'Notificações ativadas com sucesso',
                registration_id: 'notif_' + Date.now()
            };
        } catch (error) {
            throw new Error('Falha ao registrar notificações');
        }
    }

    // Estatísticas de uso
    async getUsageStats() {
        return {
            total_users: Math.floor(15000 + Math.random() * 5000),
            active_reports: Math.floor(50 + Math.random() * 30),
            resolved_incidents: Math.floor(200 + Math.random() * 100),
            average_response_time: Math.floor(3 + Math.random() * 2) + ' min',
            user_satisfaction: (4.2 + Math.random() * 0.6).toFixed(1),
            last_updated: new Date().toISOString()
        };
    }
}

// Classe para notificações push
class NotificationService {
    constructor() {
        this.permission = 'default';
        this.registration = null;
        this.init();
    }

    async init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
        }

        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.getRegistration();
            } catch (error) {
                console.error('Service Worker registration error:', error);
            }
        }
    }

    async requestPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === 'granted';
        }
        return false;
    }

    async showNotification(title, options = {}) {
        if (this.permission !== 'granted') {
            const granted = await this.requestPermission();
            if (!granted) return false;
        }

        const defaultOptions = {
            icon: './config/manifest.json',
            badge: './config/manifest.json',
            vibrate: [200, 100, 200],
            tag: 'alertavia-notification',
            requireInteraction: false,
            ...options
        };

        if (this.registration && this.registration.showNotification) {
            // Service Worker notification
            return this.registration.showNotification(title, defaultOptions);
        } else {
            // Browser notification
            return new Notification(title, defaultOptions);
        }
    }

    async showIncidentAlert(incident) {
        const title = `⚠️ Novo ${this.getIncidentTypeName(incident.type)}`;
        const options = {
            body: `${incident.location}\n${incident.description}`,
            icon: './assets/images/icon-192x192.png',
            tag: `incident-${incident.id}`,
            actions: [
                { action: 'view', title: 'Ver no Mapa' },
                { action: 'dismiss', title: 'Dispensar' }
            ],
            data: {
                type: 'incident',
                incident: incident
            }
        };

        return this.showNotification(title, options);
    }

    getIncidentTypeName(type) {
        const names = {
            floods: 'Alagamento',
            traffic: 'Problema de Trânsito',
            accident: 'Acidente',
            roadworks: 'Obra na Via'
        };
        return names[type] || 'Incidente';
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.APIService = APIService;
    window.NotificationService = NotificationService;
}
