// AlertaVia - Map Script Corrigido
// Sistema de mapa interativo com inicialização robusta

console.log('🗺️ Map script loading...');

// Função de notificação independente
function showMapNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Tentar usar o sistema de notificações se disponível
    if (window.NotificationSystem) {
        window.NotificationSystem.show(message, type);
        return;
    }
    
    // Fallback: criar toast simples
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
        font-family: system-ui, sans-serif;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

class AlertaViaMapFixed {
    constructor() {
        console.log('🚀 AlertaViaMapFixed constructor called');
        
        // Propriedades principais
        this.map = null;
        this.markers = new Map();
        this.apiService = null;
        this.isInitialized = false;
        this.initPromise = null;
        
        // Configurações
        this.config = {
            center: [-8.0476, -34.8770], // Recife, PE
            zoom: 12,
            minZoom: 10,
            maxZoom: 18
        };
        
        // Estados e filtros
        this.activeFilters = {
            floods: true,
            traffic: true,
            roadworks: true,
            accidents: true
        };
        
        // Inicializar de forma robusta
        this.initPromise = this.safeInit();
    }
    
    async safeInit() {
        try {
            console.log('🔄 Starting safe initialization...');
            
            // Aguardar DOM estar pronto
            await this.waitForDOM();
            console.log('✅ DOM ready');
            
            // Aguardar um pouco para todas as dependências carregarem
            await this.sleep(200);
            
            // Verificar dependências críticas
            await this.checkDependencies();
            console.log('✅ Dependencies checked');
            
            // Inicializar mapa
            await this.initializeMap();
            console.log('✅ Map initialized');
              // Configurar eventos
            this.setupEventListeners();
            console.log('✅ Event listeners setup');
            
            // Inicializar API Service se disponível
            if (typeof APIService !== 'undefined') {
                this.apiService = new APIService();
                console.log('✅ API Service initialized');
            } else {
                console.warn('⚠️ API Service not available, using mock data');
            }
            
            // Carregar dados iniciais
            await this.loadInitialData();
            console.log('✅ Initial data loaded');
            
            this.isInitialized = true;
            showMapNotification('Mapa carregado com sucesso!', 'success');
            console.log('🎉 AlertaVia Map initialized successfully');
            
        } catch (error) {
            console.error('❌ Map initialization failed:', error);
            showMapNotification(`Erro ao carregar mapa: ${error.message}`, 'error');
            this.handleInitError(error);
        }
    }
    
    async waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
      async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Função para exibir informações meteorológicas
    displayWeatherInfo(weatherData) {
        console.log('🌤️ Atualizando display meteorológico:', weatherData);

        // Buscar elementos individuais por ID para maior confiabilidade
        const tempElement = document.getElementById('weather-temp');
        const conditionElement = document.getElementById('weather-condition');
        const humidityElement = document.getElementById('weather-humidity');
        const iconElement = document.getElementById('weather-icon');

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

    // Função para atualizar status do servidor
    updateServerStatus(status) {
        console.log(`📡 Atualizando status de conexão: ${status}`);

        // Buscar por ID para maior confiabilidade
        const indicator = document.getElementById('connection-status') || 
                         document.querySelector('.status-indicator');
        
        if (!indicator) {
            console.warn('⚠️ Elemento de status de conexão não encontrado');
            return;
        }

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
    }    // Função para inicializar dados meteorológicos
    async initializeWeather() {
        try {
            console.log('🌤️ Inicializando dados meteorológicos...');
            
            if (this.apiService) {
                const weatherData = await this.apiService.getWeatherData();
                this.displayWeatherInfo(weatherData);
            } else {
                console.warn('⚠️ API Service não disponível, usando dados mock');
                this.displayWeatherInfo({
                    temperature: 28,
                    condition: 'Ensolarado',
                    humidity: 65,
                    icon: 'fas fa-sun'
                });
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados meteorológicos:', error);
            this.displayWeatherInfo({
                temperature: 'N/A',
                condition: 'Erro ao carregar',
                humidity: 'N/A',
                icon: 'fas fa-exclamation-triangle'
            });
        }
    }
    
    async checkDependencies() {
        // Verificar Leaflet
        if (typeof L === 'undefined') {
            throw new Error('Leaflet library not loaded');
        }
        
        // Verificar elemento do mapa
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            throw new Error('Map container element not found');
        }
        
        // Verificar se o elemento tem dimensões
        const rect = mapElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            console.warn('⚠️ Map container has zero dimensions:', rect);
        }
        
        // Inicializar API Service se disponível
        if (typeof APIService !== 'undefined') {
            try {
                this.apiService = new APIService();
                console.log('✅ API Service initialized');
            } catch (error) {
                console.warn('⚠️ API Service initialization failed:', error);
            }
        }
    }
    
    async initializeMap() {
        console.log('🗺️ Creating Leaflet map...');
        
        try {
            // Criar mapa
            this.map = L.map('map', {
                center: this.config.center,
                zoom: this.config.zoom,
                minZoom: this.config.minZoom,
                maxZoom: this.config.maxZoom,
                zoomControl: false,
                attributionControl: true
            });
            
            // Adicionar controle de zoom
            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map);
            
            // Adicionar camada de tiles
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            });
            tileLayer.addTo(this.map);
            
            // Aguardar o mapa estar realmente pronto
            await this.sleep(100);
            
            // Forçar redimensionamento do mapa
            this.map.invalidateSize();
            
            console.log('✅ Map created successfully');
            
        } catch (error) {
            console.error('❌ Error creating map:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        // Listeners para filtros
        const filterElements = ['floods', 'traffic', 'roadworks', 'accidents'];
        filterElements.forEach(filter => {
            const checkbox = document.getElementById(filter);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    this.activeFilters[filter] = e.target.checked;
                    this.updateMarkerVisibility();
                });
            }
        });
        
        // Listener para busca de localização
        const searchInput = document.getElementById('locationSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchLocation(e.target.value);
                }
            });
        }
        
        // Redimensionamento da janela
        window.addEventListener('resize', () => {
            if (this.map) {
                this.map.invalidateSize();
            }
        });
    }
    
    async loadInitialData() {
        console.log('📊 Loading initial data...');
        
        try {
            // Dados de exemplo para Recife
            const sampleIncidents = [
                {
                    id: 1,
                    type: 'traffic',
                    lat: -8.0476,
                    lng: -34.8770,
                    title: 'Trânsito Intenso - Centro',
                    description: 'Congestionamento no centro da cidade',
                    severity: 'medium',
                    timestamp: new Date()
                },
                {
                    id: 2,
                    type: 'floods',
                    lat: -8.0520,
                    lng: -34.8810,
                    title: 'Alagamento - Boa Vista',
                    description: 'Alagamento na Av. Conde da Boa Vista',
                    severity: 'high',
                    timestamp: new Date()
                },
                {
                    id: 3,
                    type: 'roadworks',
                    lat: -8.0450,
                    lng: -34.8720,
                    title: 'Obras - Espinheiro',
                    description: 'Obras na Rua Real da Torre',
                    severity: 'low',
                    timestamp: new Date()
                }
            ];
            
            // Adicionar marcadores
            sampleIncidents.forEach(incident => {
                this.addIncidentMarker(incident);
            });
              console.log(`✅ Added ${sampleIncidents.length} sample incidents`);
            
            // Inicializar dados meteorológicos
            await this.initializeWeather();
            
            // Se API Service disponível, carregar dados reais e configurar listeners
            if (this.apiService) {
                this.startRealTimeUpdates();
                
                // Listener para mudanças de status do servidor
                document.addEventListener('server-status-change', (e) => {
                    this.updateServerStatus(e.detail.status);
                });
            } else {
                // Mock do status se API Service não disponível
                this.updateServerStatus('degraded');
            }
            
        } catch (error) {
            console.error('❌ Error loading initial data:', error);
        }
    }
    
    addIncidentMarker(incident) {
        const colors = {
            traffic: '#ef4444',
            floods: '#3b82f6',
            roadworks: '#f59e0b',
            accidents: '#dc2626'
        };
        
        const color = colors[incident.type] || '#6b7280';
        
        const marker = L.marker([incident.lat, incident.lng], {
            icon: L.divIcon({
                className: 'custom-incident-marker',
                html: `
                    <div style="
                        background: ${color};
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        position: relative;
                    ">
                        <div style="
                            position: absolute;
                            top: -5px;
                            left: -5px;
                            width: 30px;
                            height: 30px;
                            border: 2px solid ${color};
                            border-radius: 50%;
                            animation: pulse 2s infinite;
                            opacity: 0.6;
                        "></div>
                    </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        });
        
        marker.bindPopup(`
            <div class="incident-popup">
                <h3>${incident.title}</h3>
                <p>${incident.description}</p>
                <div class="incident-meta">
                    <span class="severity severity-${incident.severity}">${this.getSeverityText(incident.severity)}</span>
                    <span class="timestamp">${this.formatTime(incident.timestamp)}</span>
                </div>
            </div>
        `);
        
        marker.addTo(this.map);
        this.markers.set(incident.id, { marker, incident });
    }
    
    getSeverityText(severity) {
        const severityMap = {
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta'
        };
        return severityMap[severity] || 'Desconhecida';
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    updateMarkerVisibility() {
        this.markers.forEach(({ marker, incident }) => {
            const isVisible = this.activeFilters[incident.type];
            if (isVisible) {
                marker.addTo(this.map);
            } else {
                this.map.removeLayer(marker);
            }
        });
    }
    
    async searchLocation(query) {
        if (!query.trim()) return;
        
        try {
            showMapNotification(`Buscando: ${query}...`, 'info');
            
            // Geocoding básico para Recife
            const recifeBounds = {
                north: -7.9,
                south: -8.2,
                east: -34.7,
                west: -35.0
            };
            
            // Simular busca (em produção, usar API real)
            const coords = [
                -8.0476 + (Math.random() - 0.5) * 0.1,
                -34.8770 + (Math.random() - 0.5) * 0.1
            ];
            
            this.map.setView(coords, 15);
            showMapNotification('Localização encontrada!', 'success');
            
        } catch (error) {
            console.error('❌ Search error:', error);
            showMapNotification('Erro na busca', 'error');
        }
    }
    
    startRealTimeUpdates() {
        // Atualizar dados a cada 30 segundos
        setInterval(async () => {
            if (!this.isInitialized) return;
            
            try {
                // Simular atualizações
                console.log('🔄 Updating real-time data...');
                // Aqui conectaria com APIs reais
            } catch (error) {
                console.error('❌ Real-time update error:', error);
            }
        }, 30000);
    }
      handleInitError(error) {
        // Mostrar interface de erro
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    text-align: center;
                    color: #6b7280;
                    font-family: system-ui, sans-serif;
                ">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🗺️</div>
                    <h3 style="color: #374151; margin: 0 0 0.5rem 0;">Erro ao carregar mapa</h3>
                    <p style="margin: 0 0 1rem 0;">${error.message}</p>
                    <button onclick="location.reload()" style="
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">Tentar Novamente</button>
                </div>
            `;
        }
    }
}

// Função global para abrir modal de relatório (chamada pelo HTML)
window.openReportModal = function() {
    console.log('📝 Opening report modal...');
    
    // Criar modal se não existir
    let modal = document.getElementById('reportModal');
    if (!modal) {
        modal = createReportModal();
    }
    
    modal.style.display = 'flex';
    
    // Se mapa estiver disponível, permitir seleção de localização
    if (window.alertaViaMap && window.alertaViaMap.isInitialized) {
        showMapNotification('Clique no mapa para selecionar a localização da ocorrência', 'info');
        enableLocationSelection();
    }
};

// Função global para fechar modal de relatório
window.closeReportModal = function() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'none';
    }
    disableLocationSelection();
};

function createReportModal() {
    const modal = document.createElement('div');
    modal.id = 'reportModal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        justify-content: center;
        align-items: center;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px rgba(0,0,0,0.1);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0; color: #1f2937;">📝 Reportar Ocorrência</h2>
                <button onclick="closeReportModal()" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #6b7280;
                    padding: 0.5rem;
                ">×</button>
            </div>
            
            <form id="reportForm" onsubmit="submitReport(event)">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">
                        Tipo de Ocorrência
                    </label>
                    <select id="reportType" required style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #d1d5db;
                        border-radius: 6px;
                        font-size: 1rem;
                    ">
                        <option value="">Selecione o tipo</option>
                        <option value="traffic">Trânsito Intenso</option>
                        <option value="floods">Alagamento</option>
                        <option value="accidents">Acidente</option>
                        <option value="roadworks">Obras na Via</option>
                        <option value="other">Outro</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">
                        Localização
                    </label>
                    <input type="text" id="reportLocation" placeholder="Digite o endereço ou clique no mapa" style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #d1d5db;
                        border-radius: 6px;
                        font-size: 1rem;
                        box-sizing: border-box;
                    ">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">
                        Gravidade
                    </label>
                    <select id="reportSeverity" required style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #d1d5db;
                        border-radius: 6px;
                        font-size: 1rem;
                    ">
                        <option value="low">Baixa</option>
                        <option value="medium" selected>Média</option>
                        <option value="high">Alta</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">
                        Descrição
                    </label>
                    <textarea id="reportDescription" rows="4" placeholder="Descreva a ocorrência..." style="
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #d1d5db;
                        border-radius: 6px;
                        font-size: 1rem;
                        resize: vertical;
                        box-sizing: border-box;
                    "></textarea>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" onclick="closeReportModal()" style="
                        padding: 0.75rem 1.5rem;
                        border: 1px solid #d1d5db;
                        background: white;
                        color: #374151;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Cancelar</button>
                    <button type="submit" style="
                        padding: 0.75rem 1.5rem;
                        border: none;
                        background: #3b82f6;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 1rem;
                    ">Enviar Relatório</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

let isSelectingLocation = false;
let tempMarker = null;

function enableLocationSelection() {
    if (!window.alertaViaMap || !window.alertaViaMap.map) return;
    
    isSelectingLocation = true;
    window.alertaViaMap.map.getContainer().style.cursor = 'crosshair';
    
    window.alertaViaMap.map.on('click', onMapClickForLocation);
}

function disableLocationSelection() {
    if (!window.alertaViaMap || !window.alertaViaMap.map) return;
    
    isSelectingLocation = false;
    window.alertaViaMap.map.getContainer().style.cursor = '';
    window.alertaViaMap.map.off('click', onMapClickForLocation);
    
    if (tempMarker) {
        window.alertaViaMap.map.removeLayer(tempMarker);
        tempMarker = null;
    }
}

function onMapClickForLocation(e) {
    if (!isSelectingLocation) return;
    
    const { lat, lng } = e.latlng;
    
    // Remover marcador temporário anterior
    if (tempMarker) {
        window.alertaViaMap.map.removeLayer(tempMarker);
    }
    
    // Adicionar novo marcador temporário
    tempMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'temp-location-marker',
            html: `<div style="
                background: #ef4444;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 1.2rem;
            ">📍</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(window.alertaViaMap.map);
    
    // Atualizar campo de localização
    const locationInput = document.getElementById('reportLocation');
    if (locationInput) {
        locationInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
    
    showMapNotification('Localização selecionada!', 'success');
}

// Função global para enviar relatório
window.submitReport = function(event) {
    event.preventDefault();
    
    const formData = {
        type: document.getElementById('reportType').value,
        location: document.getElementById('reportLocation').value,
        severity: document.getElementById('reportSeverity').value,
        description: document.getElementById('reportDescription').value,
        timestamp: new Date(),
        coordinates: tempMarker ? {
            lat: tempMarker.getLatLng().lat,
            lng: tempMarker.getLatLng().lng
        } : null
    };
    
    console.log('📝 Submitting report:', formData);
    
    // Simular envio
    showMapNotification('Relatório enviado com sucesso!', 'success');
    
    // Adicionar marcador permanente se coordenadas foram selecionadas
    if (formData.coordinates && window.alertaViaMap) {
        const newIncident = {
            id: Date.now(),
            type: formData.type,
            lat: formData.coordinates.lat,
            lng: formData.coordinates.lng,
            title: `${getTypeTitle(formData.type)} - ${formData.severity.toUpperCase()}`,
            description: formData.description || 'Relatório da comunidade',
            severity: formData.severity,
            timestamp: formData.timestamp
        };
        
        window.alertaViaMap.addIncidentMarker(newIncident);
    }
    
    // Fechar modal
    closeReportModal();
    
    // Limpar formulário
    document.getElementById('reportForm').reset();
};

function getTypeTitle(type) {
    const types = {
        traffic: 'Trânsito Intenso',
        floods: 'Alagamento',
        accidents: 'Acidente',
        roadworks: 'Obras na Via',
        other: 'Outras Ocorrências'
    };
    return types[type] || 'Ocorrência';
}

// Adicionar estilos para animações
const mapStyles = document.createElement('style');
mapStyles.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.2); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.6; }
    }
    
    .incident-popup {
        min-width: 200px;
    }
    
    .incident-popup h3 {
        margin: 0 0 0.5rem 0;
        color: #1f2937;
        font-size: 1rem;
    }
    
    .incident-popup p {
        margin: 0 0 1rem 0;
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .incident-meta {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .severity {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .severity-low { background: #fef3c7; color: #92400e; }
    .severity-medium { background: #fed7aa; color: #9a3412; }
    .severity-high { background: #fecaca; color: #991b1b; }
    
    .timestamp {
        font-size: 0.75rem;
        color: #9ca3af;
    }
`;
document.head.appendChild(mapStyles);

// Inicialização robusta
function initializeAlertaViaMap() {
    console.log('📍 Initializing AlertaVia Map...');
    
    // Verificar se já existe instância
    if (window.alertaViaMap) {
        console.log('⚠️ Map instance already exists');
        return window.alertaViaMap;
    }
    
    // Criar nova instância
    window.alertaViaMap = new AlertaViaMapFixed();
    return window.alertaViaMap;
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAlertaViaMap);
} else {
    // DOM já carregado, inicializar após pequeno delay
    setTimeout(initializeAlertaViaMap, 100);
}

console.log('📝 AlertaVia Map script loaded successfully');
