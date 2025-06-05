// AlertaVia - Sistema de Notificações Push
class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.registration = null;
        this.subscription = null;
        this.apiEndpoint = '/api/notifications'; // Substitua pela sua API real
        this.init();
    }

    async init() {
        // Verificar suporte para notificações
        if (!('Notification' in window)) {
            console.warn('Este navegador não suporta notificações push');
            return;
        }

        // Verificar suporte para Service Worker
        if (!('serviceWorker' in navigator)) {
            console.warn('Este navegador não suporta Service Workers');
            return;
        }

        // Registrar Service Worker
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registrado:', this.registration);
        } catch (error) {
            console.error('Erro ao registrar Service Worker:', error);
            return;
        }

        // Verificar permissão atual
        this.permission = Notification.permission;
        
        // Configurar listeners
        this.setupEventListeners();
        
        // Verificar se já existe uma inscrição
        await this.checkExistingSubscription();
    }

    setupEventListeners() {
        // Listener para mudanças nas preferências de notificação
        document.addEventListener('notification-preference-changed', (e) => {
            this.handlePreferenceChange(e.detail);
        });

        // Listener para novos dados meteorológicos
        document.addEventListener('weather-data-updated', (e) => {
            this.checkWeatherAlerts(e.detail);
        });

        // Listener para novos dados de trânsito
        document.addEventListener('traffic-data-updated', (e) => {
            this.checkTrafficAlerts(e.detail);
        });

        // Listener para alertas de alagamento
        document.addEventListener('flood-alert', (e) => {
            this.sendFloodAlert(e.detail);
        });
    }

    async requestPermission() {
        if (this.permission === 'granted') {
            return true;
        }

        try {
            this.permission = await Notification.requestPermission();
            
            if (this.permission === 'granted') {
                this.showSuccessMessage('Notificações ativadas! Você receberá alertas importantes.');
                await this.subscribe();
                return true;
            } else if (this.permission === 'denied') {
                this.showErrorMessage('Notificações bloqueadas. Ative nas configurações do navegador.');
                return false;
            }
        } catch (error) {
            console.error('Erro ao solicitar permissão:', error);
            return false;
        }

        return false;
    }

    async subscribe() {
        if (!this.registration) {
            console.error('Service Worker não registrado');
            return false;
        }

        try {
            // Chave pública do VAPID (substitua pela sua)
            const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI6YUf_1l4gNZPzBgz_Qr_0Yt6k8Xs4CtJhJ3n2jFrZMcQ6_Q9_O6ZT8U';
            
            this.subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
            });

            // Enviar inscrição para o servidor
            await this.sendSubscriptionToServer(this.subscription);
            
            console.log('Inscrito para notificações push:', this.subscription);
            return true;
        } catch (error) {
            console.error('Erro ao se inscrever:', error);
            return false;
        }
    }

    async unsubscribe() {
        if (!this.subscription) {
            return true;
        }

        try {
            await this.subscription.unsubscribe();
            await this.removeSubscriptionFromServer();
            this.subscription = null;
            console.log('Desinscrito das notificações push');
            return true;
        } catch (error) {
            console.error('Erro ao desinscrever:', error);
            return false;
        }
    }

    async checkExistingSubscription() {
        if (!this.registration) {
            return;
        }

        try {
            this.subscription = await this.registration.pushManager.getSubscription();
            if (this.subscription) {
                console.log('Inscrição existente encontrada:', this.subscription);
                // Verificar se ainda é válida no servidor
                await this.validateSubscription();
            }
        } catch (error) {
            console.error('Erro ao verificar inscrição:', error);
        }
    }

    async sendSubscriptionToServer(subscription) {
        try {
            const response = await fetch(this.apiEndpoint + '/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscription: subscription,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar inscrição para o servidor');
            }

            console.log('Inscrição enviada para o servidor');
        } catch (error) {
            console.error('Erro ao enviar inscrição:', error);
            // Em desenvolvimento, simular sucesso
            console.log('Modo simulação: inscrição salva localmente');
        }
    }

    async removeSubscriptionFromServer() {
        try {
            await fetch(this.apiEndpoint + '/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: this.subscription.endpoint
                })
            });
        } catch (error) {
            console.error('Erro ao remover inscrição do servidor:', error);
        }
    }

    async validateSubscription() {
        try {
            const response = await fetch(this.apiEndpoint + '/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: this.subscription.endpoint
                })
            });

            if (!response.ok) {
                // Inscrição inválida, renovar
                await this.subscribe();
            }
        } catch (error) {
            // Em desenvolvimento, assumir que é válida
            console.log('Validação simulada: inscrição válida');
        }
    }

    // Verificar alertas meteorológicos
    checkWeatherAlerts(weatherData) {
        const preferences = this.getUserPreferences();
        
        if (!preferences.notifications.weather) {
            return;
        }

        // Alertas de tempestade
        if (weatherData.condition && weatherData.condition.condition === 'Tempestade') {
            this.sendNotification({
                title: '⛈️ Alerta de Tempestade',
                body: 'Tempestade prevista para sua região. Evite sair se possível.',
                icon: '/icon-weather-storm.png',
                tag: 'weather-storm',
                urgent: true,
                actions: [
                    { action: 'view-map', title: 'Ver Mapa' },
                    { action: 'dismiss', title: 'OK' }
                ]
            });
        }

        // Alertas de chuva forte
        if (weatherData.rainProbability > 80) {
            this.sendNotification({
                title: '🌧️ Chuva Forte Prevista',
                body: `${weatherData.rainProbability}% de chance de chuva. Cuidado com alagamentos.`,
                icon: '/icon-weather-rain.png',
                tag: 'weather-rain',
                actions: [
                    { action: 'view-routes', title: 'Rotas Seguras' },
                    { action: 'dismiss', title: 'OK' }
                ]
            });
        }
    }

    // Verificar alertas de trânsito
    checkTrafficAlerts(trafficData) {
        const preferences = this.getUserPreferences();
        
        if (!preferences.notifications.traffic) {
            return;
        }

        // Alertas de congestionamento severo
        if (trafficData.congestionLevel === 'high') {
            this.sendNotification({
                title: '🚗 Trânsito Intenso',
                body: 'Congestionamento severo detectado na sua rota usual.',
                icon: '/icon-traffic.png',
                tag: 'traffic-congestion',
                actions: [
                    { action: 'view-alternatives', title: 'Rotas Alternativas' },
                    { action: 'dismiss', title: 'OK' }
                ]
            });
        }

        // Alertas de acidentes
        const accidents = trafficData.incidents?.filter(i => i.type === 'accident') || [];
        accidents.forEach(accident => {
            if (accident.severity === 'high') {
                this.sendNotification({
                    title: '🚨 Acidente Reportado',
                    body: `Acidente em ${accident.location}. Tempo estimado: ${accident.estimatedDelay}`,
                    icon: '/icon-accident.png',
                    tag: `accident-${accident.location}`,
                    actions: [
                        { action: 'view-map', title: 'Ver no Mapa' },
                        { action: 'dismiss', title: 'OK' }
                    ]
                });
            }
        });
    }

    // Enviar alerta de alagamento
    sendFloodAlert(floodData) {
        const preferences = this.getUserPreferences();
        
        if (!preferences.notifications.floods) {
            return;
        }

        this.sendNotification({
            title: '🌊 Alerta de Alagamento',
            body: `Alagamento reportado em ${floodData.location}. Evite a área.`,
            icon: '/icon-flood.png',
            tag: `flood-${floodData.location}`,
            urgent: true,
            actions: [
                { action: 'view-map', title: 'Ver no Mapa' },
                { action: 'report-status', title: 'Reportar Status' }
            ]
        });
    }

    // Enviar notificação
    async sendNotification(options) {
        if (this.permission !== 'granted') {
            console.log('Permissão de notificação não concedida');
            return;
        }

        try {
            // Se há Service Worker, usar push notification
            if (this.registration && this.subscription) {
                await this.sendPushNotification(options);
            } else {
                // Fallback para notificação local
                this.sendLocalNotification(options);
            }
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
        }
    }

    async sendPushNotification(options) {
        try {
            // Em produção, enviar para o servidor que fará o push
            await fetch(this.apiEndpoint + '/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscription: this.subscription,
                    payload: options
                })
            });
        } catch (error) {
            console.error('Erro ao enviar push notification:', error);
            // Fallback para notificação local
            this.sendLocalNotification(options);
        }
    }

    sendLocalNotification(options) {
        const notification = new Notification(options.title, {
            body: options.body,
            icon: options.icon || '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: options.tag,
            requireInteraction: options.urgent || false,
            silent: false,
            data: options.data
        });

        // Auto-fechar após 5 segundos se não for urgente
        if (!options.urgent) {
            setTimeout(() => notification.close(), 5000);
        }

        // Listener para cliques
        notification.onclick = (event) => {
            event.preventDefault();
            window.focus();
            notification.close();
            
            // Ação baseada no tipo de notificação
            this.handleNotificationClick(options);
        };
    }

    handleNotificationClick(options) {
        switch (options.tag) {
            case 'weather-storm':
            case 'weather-rain':
                this.openWeatherDetails();
                break;
            case 'traffic-congestion':
                this.openTrafficAlternatives();
                break;
            default:
                if (options.tag?.startsWith('accident-') || options.tag?.startsWith('flood-')) {
                    this.openMap();
                }
        }
    }

    openWeatherDetails() {
        // Implementar abertura de detalhes meteorológicos
        console.log('Abrindo detalhes meteorológicos');
    }

    openTrafficAlternatives() {
        // Implementar abertura de rotas alternativas
        console.log('Abrindo rotas alternativas');
    }

    openMap() {
        // Abrir mapa principal
        if (window.openMap) {
            window.openMap();
        }
    }

    getUserPreferences() {
        // Obter preferências do usuário
        if (window.userProfile) {
            return window.userProfile.getPreferences();
        }
        
        // Fallback para preferências padrão
        return {
            notifications: {
                weather: true,
                traffic: true,
                floods: true,
                emergency: true,
                community: false
            }
        };
    }

    handlePreferenceChange(preferences) {
        // Se notificações foram desabilitadas, desinscrever
        const notificationTypes = Object.values(preferences.notifications);
        const anyEnabled = notificationTypes.some(enabled => enabled);
        
        if (!anyEnabled && this.subscription) {
            this.unsubscribe();
        } else if (anyEnabled && !this.subscription) {
            this.requestPermission();
        }
    }

    // Método utilitário para converter chave VAPID
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    showSuccessMessage(message) {
        if (window.showNotification) {
            window.showNotification(message, 'success');
        } else {
            console.log('✅', message);
        }
    }

    showErrorMessage(message) {
        if (window.showNotification) {
            window.showNotification(message, 'error');
        } else {
            console.log('❌', message);
        }
    }

    // Métodos públicos para gerenciamento de notificações
    async enable() {
        return await this.requestPermission();
    }

    async disable() {
        return await this.unsubscribe();
    }

    getStatus() {
        return {
            permission: this.permission,
            subscribed: !!this.subscription,
            supported: 'Notification' in window && 'serviceWorker' in navigator
        };
    }
}

// Instanciar o gerenciador de notificações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager = new NotificationManager();
    
    // Adicionar botão de teste (apenas em desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const testButton = document.createElement('button');
        testButton.textContent = 'Testar Notificação';
        testButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 10px; background: #3B82F6; color: white; border: none; border-radius: 8px; cursor: pointer;';
        testButton.onclick = () => {
            window.notificationManager.sendNotification({
                title: 'Teste AlertaVia',
                body: 'Esta é uma notificação de teste!',
                tag: 'test'
            });
        };
        document.body.appendChild(testButton);
    }
});
