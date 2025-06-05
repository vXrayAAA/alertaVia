// Teste simplificado da classe AlertaViaMap
console.log('🗺️ Carregando script de teste do mapa...');

class AlertaViaMapSimple {
    constructor() {
        console.log('🚀 AlertaViaMapSimple constructor');
        this.map = null;
        this.isInitialized = false;
        
        // Aguardar DOM carregar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            setTimeout(() => this.init(), 100);
        }
    }
    
    init() {
        console.log('🔄 Inicializando mapa simples...');
        
        try {
            // Verificar Leaflet
            if (typeof L === 'undefined') {
                throw new Error('Leaflet não carregado');
            }
            console.log('✅ Leaflet disponível');
            
            // Verificar elemento do mapa
            const mapElement = document.getElementById('map');
            if (!mapElement) {
                throw new Error('Elemento #map não encontrado');
            }
            console.log('✅ Elemento #map encontrado');
            
            // Criar mapa
            this.map = L.map('map').setView([-8.0476, -34.8770], 12);
            console.log('✅ Mapa criado');
            
            // Adicionar tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);
            console.log('✅ Tiles adicionados');
            
            // Adicionar marcador teste
            const marker = L.marker([-8.0476, -34.8770]).addTo(this.map);
            marker.bindPopup('<b>AlertaVia</b><br>Recife - PE').openPopup();
            console.log('✅ Marcador adicionado');
            
            this.isInitialized = true;
            console.log('🎉 Mapa inicializado com sucesso!');
            
            // Mostrar notificação
            this.showSimpleNotification('Mapa carregado com sucesso!', 'success');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar mapa:', error);
            this.showSimpleNotification('Erro ao carregar mapa: ' + error.message, 'error');
        }
    }
    
    showSimpleNotification(message, type = 'info') {
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
            font-family: Arial, sans-serif;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 4000);
    }
}

// Inicializar na carga da página
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM carregado, criando instância do mapa...');
    window.mapInstanceSimple = new AlertaViaMapSimple();
});

console.log('📝 Script de teste do mapa carregado');
