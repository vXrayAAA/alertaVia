// Função de fallback para notificações se NotificationManager não estiver disponível
function showNotification(message, type = 'info') {
    if (window.NotificationManager) {
        window.NotificationManager.show(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // Criar toast simples
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// AlertaVia - Map Integration Script
// Sistema de mapa interativo com tempo real

console.log('🗺️ Map script loading...');

class AlertaViaMap {
    constructor() {
        console.log('🚀 AlertaViaMap constructor called');
        this.map = null;
        this.markers = new Map();
        this.currentLocation = null;
        this.apiService = null;
        this.selectedReportLocation = null;
        this.isInitialized = false;
        this.reportMarker = null;
        
        // Configurações do mapa
        this.config = {
            center: [-8.0476, -34.8770], // Recife
            zoom: 12,
            minZoom: 10,
            maxZoom: 18
        };

        // Camadas de mapa
        this.mapLayers = {
            street: null,
            satellite: null,
            terrain: null
        };

        // Filtros ativos
        this.activeFilters = {
            floods: true,
            traffic: true,
            roadworks: true,
            accidents: true
        };

        // Aguardar um pouco antes de inicializar
        setTimeout(() => this.init(), 100);
    }

    async init() {
        try {
            console.log('🔄 Initializing map...');
            await this.waitForDOMLoad();
            console.log('✅ DOM loaded');
            
            await this.loadDependencies();
            console.log('✅ Dependencies loaded');
            
            this.initializeMap();
            console.log('✅ Map initialized');
            
            this.setupEventListeners();
            console.log('✅ Event listeners setup');
            
            this.startRealTimeUpdates();
            console.log('✅ Real-time updates started');
            
            this.isInitialized = true;
            console.log('✅ AlertaVia Map initialized successfully');
            
            // Notificar sucesso
            showNotification('Mapa carregado com sucesso!', 'success');
        } catch (error) {
            console.error('❌ Map initialization failed:', error);
            this.handleInitError(error);
        }
    }

    async waitForDOMLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }    async loadDependencies() {
        console.log('🔍 Checking Leaflet...');
        // Verificar se o Leaflet está disponível
        if (typeof L === 'undefined') {
            console.error('❌ Leaflet library not loaded');
            throw new Error('Leaflet library not loaded');
        }
        console.log('✅ Leaflet is available');

        // Inicializar APIService se disponível
        if (typeof APIService !== 'undefined') {
            console.log('🔄 Initializing APIService...');
            this.apiService = new APIService();
            console.log('✅ APIService initialized');
        } else {
            console.warn('⚠️ APIService not available');
        }
    }    initializeMap() {
        console.log('🗺️ Initializing map...');
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('❌ Map container not found');
            throw new Error('Map container not found');
        }
        console.log('✅ Map container found:', mapContainer);

        try {
            // Inicializar mapa
            console.log('🔄 Creating Leaflet map...');
            this.map = L.map('map', {
                center: this.config.center,
                zoom: this.config.zoom,
                minZoom: this.config.minZoom,
                maxZoom: this.config.maxZoom,
                zoomControl: false
            });
            console.log('✅ Leaflet map created');

            // Adicionar controle de zoom personalizado
            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map);
            console.log('✅ Zoom controls added');

            // Configurar camadas de mapa
            this.setupMapLayers();
            console.log('✅ Map layers setup');
            
            // Carregar dados iniciais
            this.loadInitialData();
            console.log('✅ Initial data loading started');
        } catch (error) {
            console.error('❌ Error initializing map:', error);
            throw error;
        }
    }    setupMapLayers() {
        console.log('🌍 Setting up map layers...');
        try {
            // Camada de ruas (padrão)
            this.mapLayers.street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);
            console.log('✅ Street layer added');

            // Camada de satélite
            this.mapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri',
                maxZoom: 19
            });
            console.log('✅ Satellite layer created');

            // Camada de terreno
            this.mapLayers.terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenTopoMap contributors',
                maxZoom: 17
            });
            console.log('✅ Terrain layer created');
        } catch (error) {
            console.error('❌ Error setting up map layers:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Filtros de incidentes
        Object.keys(this.activeFilters).forEach(filter => {
            const checkbox = document.getElementById(filter);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    this.activeFilters[filter] = e.target.checked;
                    this.updateMarkersVisibility();
                });
            }
        });

        // Botões de camadas
        document.querySelectorAll('.layer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layer = e.currentTarget.dataset.layer;
                this.changeMapLayer(layer);
                
                // Atualizar UI
                document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Clique no mapa para reportar
        this.map.on('click', (e) => {
            if (this.isReportModeActive()) {
                this.setReportLocation(e.latlng);
            }
        });

        // Status do servidor
        document.addEventListener('server-status-change', (e) => {
            this.updateServerStatus(e.detail.status);
        });

        // Busca de localização
        const searchInput = document.getElementById('locationSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchLocation();
                }
            });
        }
    }

    changeMapLayer(layerType) {
        // Remover camada atual
        Object.values(this.mapLayers).forEach(layer => {
            if (this.map.hasLayer(layer)) {
                this.map.removeLayer(layer);
            }
        });

        // Adicionar nova camada
        if (this.mapLayers[layerType]) {
            this.mapLayers[layerType].addTo(this.map);
        }
    }

    async loadInitialData() {
        try {
            // Mostrar loading
            this.showLoading('Carregando dados do mapa...');

            // Carregar dados meteorológicos
            await this.updateWeatherData();

            // Carregar incidentes de trânsito
            await this.updateTrafficData();

            // Tentar obter localização do usuário
            this.getCurrentLocation();

        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            this.hideLoading();
        }
    }

    async updateWeatherData() {
        if (!this.apiService) return;

        try {
            const weatherData = await this.apiService.getWeatherData();
            this.displayWeatherInfo(weatherData);
        } catch (error) {
            console.error('Weather update failed:', error);
        }
    }    displayWeatherInfo(weatherData) {
        // Buscar elementos individuais por ID para maior confiabilidade
        const tempElement = document.getElementById('weather-temp');
        const conditionElement = document.getElementById('weather-condition');
        const humidityElement = document.getElementById('weather-humidity');
        const iconElement = document.getElementById('weather-icon');

        console.log('🌤️ Atualizando display meteorológico:', weatherData);

        if (tempElement) {
            tempElement.textContent = `${weatherData.temperature || 'N/A'}°C`;
        }

        if (conditionElement) {
            const condition = weatherData.condition?.condition || weatherData.condition || 'Indisponível';
            conditionElement.textContent = condition;
        }

        if (humidityElement) {
            humidityElement.textContent = `Umidade: ${weatherData.humidity || 'N/A'}%`;
        }

        if (iconElement && weatherData.condition?.icon) {
            iconElement.className = `${weatherData.condition.icon} weather-icon`;
        } else if (iconElement && weatherData.icon) {
            iconElement.className = `${weatherData.icon} weather-icon`;
        }

        console.log('✅ Interface meteorológica atualizada');
    }

    async updateTrafficData() {
        if (!this.apiService) return;

        try {
            const trafficData = await this.apiService.getTrafficData();
            this.displayTrafficIncidents(trafficData.incidents);
            this.updateAlertsPanel(trafficData.incidents);
        } catch (error) {
            console.error('Traffic update failed:', error);
        }
    }

    displayTrafficIncidents(incidents) {
        // Limpar marcadores existentes
        this.clearMarkers();

        // Adicionar novos marcadores
        incidents.forEach(incident => {
            this.addIncidentMarker(incident);
        });
    }

    addIncidentMarker(incident) {
        const icon = this.getIncidentIcon(incident.type, incident.severity);
        
        const marker = L.marker(incident.coordinates, { icon })
            .addTo(this.map)
            .bindPopup(this.createIncidentPopup(incident));

        // Armazenar referência
        this.markers.set(incident.id, {
            marker,
            type: incident.type,
            visible: this.activeFilters[incident.type]
        });

        // Aplicar visibilidade
        if (!this.activeFilters[incident.type]) {
            this.map.removeLayer(marker);
        }
    }

    getIncidentIcon(type, severity) {
        const iconConfig = {
            floods: { icon: '💧', color: '#3b82f6' },
            traffic: { icon: '🚗', color: '#f59e0b' },
            accidents: { icon: '⚠️', color: '#ef4444' },
            roadworks: { icon: '🚧', color: '#8b5cf6' }
        };

        const config = iconConfig[type] || iconConfig.traffic;
        const size = severity === 'high' ? 40 : severity === 'medium' ? 35 : 30;

        return L.divIcon({
            className: `incident-marker ${type} ${severity}`,
            html: `<div style="
                background: ${config.color};
                border-radius: 50%;
                width: ${size}px;
                height: ${size}px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${size * 0.5}px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 2px solid white;
            ">${config.icon}</div>`,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
        });
    }

    createIncidentPopup(incident) {
        const severityText = {
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta',
            critical: 'Crítica'
        };

        return `
            <div class="incident-popup">
                <h4>${incident.description}</h4>
                <div class="incident-details">
                    <p><strong>Local:</strong> ${incident.location}</p>
                    <p><strong>Severidade:</strong> ${severityText[incident.severity]}</p>
                    ${incident.estimatedDelay ? `<p><strong>Atraso:</strong> ${incident.estimatedDelay}</p>` : ''}
                    <p><strong>Confirmações:</strong> ${incident.confirmations || 0}</p>
                    <p><strong>Reportado:</strong> ${this.formatTime(incident.timestamp)}</p>
                </div>
                <div class="popup-actions">
                    <button onclick="mapInstance.confirmIncident('${incident.id}')" class="btn-confirm">
                        👍 Confirmar
                    </button>
                    <button onclick="mapInstance.getRouteAround('${incident.id}')" class="btn-route">
                        🚗 Rota alternativa
                    </button>
                </div>
            </div>
        `;
    }

    updateMarkersVisibility() {
        this.markers.forEach((markerData, id) => {
            const shouldShow = this.activeFilters[markerData.type];
            
            if (shouldShow && !this.map.hasLayer(markerData.marker)) {
                this.map.addLayer(markerData.marker);
            } else if (!shouldShow && this.map.hasLayer(markerData.marker)) {
                this.map.removeLayer(markerData.marker);
            }
        });
    }

    clearMarkers() {
        this.markers.forEach((markerData) => {
            this.map.removeLayer(markerData.marker);
        });
        this.markers.clear();
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            console.warn('Geolocation not supported');
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutos
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.currentLocation = [latitude, longitude];
                this.addUserLocationMarker();
                this.centerMapOnUser();
            },
            (error) => {
                console.warn('Geolocation error:', error.message);
                showNotification('Não foi possível obter sua localização', 'warning');
            },
            options
        );
    }

    addUserLocationMarker() {
        if (!this.currentLocation) return;

        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `<div style="
                background: #3b82f6;
                border: 3px solid white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
                animation: pulse 2s infinite;
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        L.marker(this.currentLocation, { icon: userIcon })
            .addTo(this.map)
            .bindPopup('📍 Sua localização atual');
    }

    centerMapOnUser() {
        if (this.currentLocation) {
            this.map.setView(this.currentLocation, 15);
        }
    }

    async searchLocation() {
        const searchInput = document.getElementById('locationSearch');
        if (!searchInput || !searchInput.value.trim()) return;

        const query = searchInput.value.trim();
        
        try {
            this.showLoading('Buscando localização...');
            
            // Simular busca (em produção usar Nominatim ou similar)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Coordenadas fictícias para demonstração
            const results = [
                { lat: -8.0476, lng: -34.8770, display_name: query }
            ];

            if (results.length > 0) {
                const result = results[0];
                this.map.setView([result.lat, result.lng], 15);
                
                L.marker([result.lat, result.lng])
                    .addTo(this.map)
                    .bindPopup(`📍 ${result.display_name}`)
                    .openPopup();

                showNotification('Localização encontrada!', 'success');
            }
        } catch (error) {
            console.error('Search error:', error);
            showNotification('Erro ao buscar localização', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Funcionalidades para reportar incidentes
    isReportModeActive() {
        const modal = document.getElementById('reportModal');
        return modal && modal.style.display !== 'none';
    }

    setReportLocation(latlng) {
        this.selectedReportLocation = latlng;
        
        // Atualizar campo de localização no modal
        const locationInput = document.getElementById('reportLocation');
        if (locationInput) {
            locationInput.value = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
        }

        // Adicionar marcador temporário
        if (this.reportMarker) {
            this.map.removeLayer(this.reportMarker);
        }

        this.reportMarker = L.marker([latlng.lat, latlng.lng], {
            icon: L.divIcon({
                className: 'report-marker',
                html: '📍',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(this.map);

        showNotification('Localização selecionada para o relatório', 'info');
    }

    async submitReport(reportData) {
        if (!this.apiService) {
            throw new Error('API Service not available');
        }

        try {
            const response = await this.apiService.submitUserReport({
                ...reportData,
                coordinates: this.selectedReportLocation ? 
                    [this.selectedReportLocation.lat, this.selectedReportLocation.lng] : null
            });

            // Limpar marcador de relatório
            if (this.reportMarker) {
                this.map.removeLayer(this.reportMarker);
                this.reportMarker = null;
            }

            return response;
        } catch (error) {
            console.error('Report submission error:', error);
            throw error;
        }
    }

    // Atualizações em tempo real
    startRealTimeUpdates() {
        // Atualizar dados a cada 30 segundos
        setInterval(() => {
            if (this.isInitialized) {
                this.updateTrafficData();
                this.updateWeatherData();
            }
        }, 30000);
    }

    // Utilitários
    formatTime(timestamp) {
        if (!timestamp) return 'Desconhecido';
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `há ${diffMins} min`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `há ${diffHours}h`;
        
        return date.toLocaleDateString('pt-BR');
    }

    showLoading(message = 'Carregando...') {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            const text = overlay.querySelector('p');
            if (text) text.textContent = message;
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }    updateServerStatus(status) {
        // Buscar por ID para maior confiabilidade
        const indicator = document.getElementById('connection-status') || document.querySelector('.status-indicator');
        if (!indicator) {
            console.warn('⚠️ Elemento de status de conexão não encontrado');
            return;
        }

        console.log(`📡 Atualizando status de conexão: ${status}`);

        indicator.className = `status-indicator ${status}`;
        
        const statusText = {
            online: '🟢 Online',
            degraded: '🟡 Instável', 
            offline: '🔴 Offline',
            connecting: '🔄 Conectando...'
        };

        const currentTime = new Date().toLocaleTimeString('pt-BR');
        indicator.innerHTML = `
            ${statusText[status] || statusText.offline}
            <small>Última verificação: ${currentTime}</small>
        `;

        console.log('✅ Status de conexão atualizado na interface');
    }

    updateAlertsPanel(incidents) {
        const alertsList = document.querySelector('.alerts-list');
        if (!alertsList) return;

        alertsList.innerHTML = incidents.slice(0, 4).map(incident => `
            <div class="alert-item ${incident.type}">
                <div class="alert-icon">
                    <i class="${this.getIncidentIconClass(incident.type)}"></i>
                </div>
                <div class="alert-content">
                    <h4>${incident.description}</h4>
                    <p>${incident.location} • ${this.formatTime(incident.timestamp)}</p>
                    <span class="alert-status">Confirmado por ${incident.confirmations} usuários</span>
                </div>
            </div>
        `).join('');
    }

    getIncidentIconClass(type) {
        const icons = {
            floods: 'fas fa-water',
            traffic: 'fas fa-car',
            accidents: 'fas fa-exclamation-triangle',
            roadworks: 'fas fa-tools'
        };
        return icons[type] || 'fas fa-info-circle';
    }

    handleInitError(error) {
        console.error('Map initialization error:', error);
        
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erro ao carregar mapa</h3>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" class="btn-retry">
                        <i class="fas fa-redo"></i> Tentar novamente
                    </button>
                </div>
            `;
        }

        showNotification('Erro ao carregar mapa. Verifique sua conexão.', 'error');
    }

    // Métodos públicos para interação externa
    confirmIncident(incidentId) {
        console.log('Confirming incident:', incidentId);
        showNotification('Incidente confirmado! Obrigado pela contribuição.', 'success');
    }

    getRouteAround(incidentId) {
        console.log('Getting route around incident:', incidentId);
        showNotification('Calculando rota alternativa...', 'info');
    }
}

// Funções globais para compatibilidade
function getCurrentLocation() {
    if (window.mapInstance) {
        window.mapInstance.getCurrentLocation();
    }
}

function searchLocation() {
    if (window.mapInstance) {
        window.mapInstance.searchLocation();
    }
}

function openReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Limpar marcador de relatório
    if (window.mapInstance && window.mapInstance.reportMarker) {
        window.mapInstance.map.removeLayer(window.mapInstance.reportMarker);
        window.mapInstance.reportMarker = null;
    }
}

function toggleAlertsPanel() {
    const panel = document.querySelector('.alerts-panel');
    if (panel) {
        panel.classList.toggle('collapsed');
    }
}

async function submitReport(event) {
    event.preventDefault();
    
    if (!window.mapInstance) {
        alert('Sistema de mapa não inicializado');
        return;
    }

    const formData = new FormData(event.target);
    const reportData = {
        type: formData.get('reportType') || document.getElementById('reportType').value,
        location: formData.get('reportLocation') || document.getElementById('reportLocation').value,
        description: formData.get('reportDescription') || document.getElementById('reportDescription').value,
        severity: formData.get('reportSeverity') || document.getElementById('reportSeverity').value
    };

    try {
        // Mostrar loading no botão
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        await window.mapInstance.submitReport(reportData);
        
        showNotification('Relatório enviado com sucesso!', 'success');
        
        closeReportModal();
        event.target.reset();
        
    } catch (error) {
        console.error('Report submission failed:', error);
        showNotification('Erro ao enviar relatório. Tente novamente.', 'error');
    } finally {
        // Restaurar botão
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Relatório';
        submitBtn.disabled = false;
    }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que todas as dependências estejam carregadas
    setTimeout(() => {
        window.mapInstance = new AlertaViaMap();
    }, 100);
});

// Adicionar estilos de animação para pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .map-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
    
    .map-error i {
        font-size: 3rem;
        color: var(--accent-color);
        margin-bottom: 1rem;
    }
    
    .btn-retry {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .btn-retry:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
    }
    
    .incident-popup {
        min-width: 250px;
    }
    
    .incident-details {
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }
    
    .popup-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .btn-confirm, .btn-route {
        flex: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
    }
    
    .btn-confirm {
        background: #10b981;
        color: white;
    }
    
    .btn-route {
        background: #3b82f6;
        color: white;
    }
    
    .btn-confirm:hover {
        background: #059669;
    }
    
    .btn-route:hover {
        background: #2563eb;
    }
`;
document.head.appendChild(style);
