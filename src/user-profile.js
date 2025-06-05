// AlertaVia - Gerenciamento de Perfil do Usuário
class UserProfile {
    constructor() {
        this.profileData = null;
        this.preferences = {
            theme: 'auto',
            notifications: {
                weather: true,
                traffic: true,
                floods: true,
                emergency: true,
                community: false
            },
            location: {
                allowTracking: false,
                homeAddress: '',
                workAddress: '',
                preferredRoutes: []
            },
            privacy: {
                shareLocation: false,
                shareReports: true,
                analytics: true
            },
            accessibility: {
                highContrast: false,
                largeText: false,
                screenReader: false,
                reducedMotion: false
            }
        };
        this.init();
    }

    init() {
        this.loadUserData();
        this.createProfileModal();
        this.setupEventListeners();
    }

    loadUserData() {
        // Carregar dados do perfil salvos
        const savedProfile = localStorage.getItem('alertavia_profile');
        if (savedProfile) {
            try {
                this.profileData = JSON.parse(savedProfile);
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            }
        }

        // Carregar preferências salvas
        const savedPreferences = localStorage.getItem('alertavia_preferences');
        if (savedPreferences) {
            try {
                this.preferences = { ...this.preferences, ...JSON.parse(savedPreferences) };
            } catch (error) {
                console.error('Erro ao carregar preferências:', error);
            }
        }
    }

    saveUserData() {
        try {
            if (this.profileData) {
                localStorage.setItem('alertavia_profile', JSON.stringify(this.profileData));
            }
            localStorage.setItem('alertavia_preferences', JSON.stringify(this.preferences));
            
            // Emitir evento para atualizar UI
            document.dispatchEvent(new CustomEvent('profile-updated', {
                detail: { profile: this.profileData, preferences: this.preferences }
            }));
            
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados do usuário:', error);
            return false;
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="profile"]')) {
                e.preventDefault();
                this.showProfileModal();
            } else if (e.target.matches('[data-action="settings"]')) {
                e.preventDefault();
                this.showSettingsModal();
            }
        });

        // Listener para mudanças de tema
        document.addEventListener('theme-changed', (e) => {
            this.preferences.theme = e.detail.theme;
            this.saveUserData();
        });

        // Listener para mudanças de localização
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                (position) => this.updateLocation(position),
                (error) => console.log('Erro de geolocalização:', error),
                { enableHighAccuracy: false, timeout: 10000 }
            );
        }
    }

    createProfileModal() {
        const profileModal = document.createElement('div');
        profileModal.id = 'profileModal';
        profileModal.className = 'auth-modal profile-modal';
        profileModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Meu Perfil</h2>
                    <button class="close-modal" data-close="profileModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="profile-tabs">
                        <button class="tab-button active" data-tab="profile">Perfil</button>
                        <button class="tab-button" data-tab="preferences">Preferências</button>
                        <button class="tab-button" data-tab="privacy">Privacidade</button>
                        <button class="tab-button" data-tab="accessibility">Acessibilidade</button>
                    </div>
                    
                    <div class="tab-content active" data-content="profile">
                        <div class="profile-section">
                            <div class="profile-avatar">
                                <img id="profileAvatar" src="/default-avatar.png" alt="Avatar">
                                <button class="change-avatar">
                                    <i class="fas fa-camera"></i>
                                </button>
                            </div>
                            <div class="profile-info">
                                <div class="form-group">
                                    <label for="profileName">Nome completo</label>
                                    <input type="text" id="profileName" placeholder="Seu nome">
                                </div>
                                <div class="form-group">
                                    <label for="profileEmail">E-mail</label>
                                    <input type="email" id="profileEmail" placeholder="seu@email.com" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="profilePhone">Telefone</label>
                                    <input type="tel" id="profilePhone" placeholder="(81) 99999-9999">
                                </div>
                                <div class="form-group">
                                    <label for="profileBio">Sobre você</label>
                                    <textarea id="profileBio" placeholder="Conte um pouco sobre você..." rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" data-content="preferences">
                        <div class="preferences-section">
                            <h3>Notificações</h3>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="notifWeather">
                                    <span class="toggle-slider"></span>
                                    Alertas meteorológicos
                                </label>
                            </div>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="notifTraffic">
                                    <span class="toggle-slider"></span>
                                    Alertas de trânsito
                                </label>
                            </div>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="notifFloods">
                                    <span class="toggle-slider"></span>
                                    Alertas de alagamento
                                </label>
                            </div>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="notifEmergency">
                                    <span class="toggle-slider"></span>
                                    Alertas de emergência
                                </label>
                            </div>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="notifCommunity">
                                    <span class="toggle-slider"></span>
                                    Mensagens da comunidade
                                </label>
                            </div>
                            
                            <h3>Localização</h3>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="allowTracking">
                                    <span class="toggle-slider"></span>
                                    Permitir rastreamento de localização
                                </label>
                            </div>
                            <div class="form-group">
                                <label for="homeAddress">Endereço residencial</label>
                                <input type="text" id="homeAddress" placeholder="Rua, bairro, cidade">
                            </div>
                            <div class="form-group">
                                <label for="workAddress">Endereço do trabalho</label>
                                <input type="text" id="workAddress" placeholder="Rua, bairro, cidade">
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" data-content="privacy">
                        <div class="privacy-section">
                            <h3>Privacidade e Dados</h3>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="shareLocation">
                                    <span class="toggle-slider"></span>
                                    Compartilhar localização com outros usuários
                                </label>
                                <p class="preference-description">
                                    Permite que outros usuários vejam sua localização em tempo real
                                </p>
                            </div>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="shareReports">
                                    <span class="toggle-slider"></span>
                                    Compartilhar meus relatórios publicamente
                                </label>
                                <p class="preference-description">
                                    Seus relatórios de trânsito e alagamentos serão visíveis para outros usuários
                                </p>
                            </div>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="analytics">
                                    <span class="toggle-slider"></span>
                                    Permitir coleta de dados de uso
                                </label>
                                <p class="preference-description">
                                    Ajuda a melhorar o aplicativo através de dados anônimos de uso
                                </p>
                            </div>
                            
                            <h3>Gerenciar Dados</h3>
                            <button class="btn btn-outline" id="exportData">
                                <i class="fas fa-download"></i>
                                Exportar meus dados
                            </button>
                            <button class="btn btn-danger" id="deleteAccount">
                                <i class="fas fa-trash"></i>
                                Excluir minha conta
                            </button>
                        </div>
                    </div>
                    
                    <div class="tab-content" data-content="accessibility">
                        <div class="accessibility-section">
                            <h3>Acessibilidade</h3>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="highContrast">
                                    <span class="toggle-slider"></span>
                                    Alto contraste
                                </label>
                            </div>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="largeText">
                                    <span class="toggle-slider"></span>
                                    Texto grande
                                </label>
                            </div>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="screenReader">
                                    <span class="toggle-slider"></span>
                                    Otimizar para leitores de tela
                                </label>
                            </div>
                            <div class="preference-item">
                                <label class="toggle-label">
                                    <input type="checkbox" id="reducedMotion">
                                    <span class="toggle-slider"></span>
                                    Reduzir animações
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" data-close="profileModal">Cancelar</button>
                    <button class="btn btn-primary" id="saveProfile">Salvar alterações</button>
                </div>
            </div>
        `;

        document.body.appendChild(profileModal);
        this.setupModalEvents(profileModal);
    }

    setupModalEvents(modal) {
        // Tabs
        modal.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Save button
        modal.querySelector('#saveProfile').addEventListener('click', () => {
            this.saveProfileData();
        });

        // Close modal
        modal.querySelectorAll('[data-close="profileModal"]').forEach(btn => {
            btn.addEventListener('click', () => this.hideProfileModal());
        });

        // Toggle switches
        modal.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updatePreference(e.target.id, e.target.checked);
            });
        });

        // Data management
        modal.querySelector('#exportData').addEventListener('click', () => {
            this.exportUserData();
        });

        modal.querySelector('#deleteAccount').addEventListener('click', () => {
            this.showDeleteConfirmation();
        });
    }

    switchTab(tabName) {
        // Remover active das tabs
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Ativar tab selecionada
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.querySelector(`[data-content="${tabName}"]`).classList.add('active');
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            this.populateProfileForm();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    populateProfileForm() {
        // Preencher dados do perfil
        if (this.profileData) {
            const fields = ['profileName', 'profileEmail', 'profilePhone', 'profileBio'];
            fields.forEach(field => {
                const element = document.getElementById(field);
                if (element && this.profileData[field.replace('profile', '').toLowerCase()]) {
                    element.value = this.profileData[field.replace('profile', '').toLowerCase()];
                }
            });
        }

        // Preencher preferências
        Object.keys(this.preferences.notifications).forEach(key => {
            const checkbox = document.getElementById(`notif${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (checkbox) {
                checkbox.checked = this.preferences.notifications[key];
            }
        });

        // Localização
        const locationFields = {
            'allowTracking': this.preferences.location.allowTracking,
            'homeAddress': this.preferences.location.homeAddress,
            'workAddress': this.preferences.location.workAddress
        };

        Object.keys(locationFields).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = locationFields[key];
                } else {
                    element.value = locationFields[key] || '';
                }
            }
        });

        // Privacidade
        Object.keys(this.preferences.privacy).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = this.preferences.privacy[key];
            }
        });

        // Acessibilidade
        Object.keys(this.preferences.accessibility).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = this.preferences.accessibility[key];
            }
        });
    }

    updatePreference(key, value) {
        const categoryMap = {
            'notifWeather': ['notifications', 'weather'],
            'notifTraffic': ['notifications', 'traffic'],
            'notifFloods': ['notifications', 'floods'],
            'notifEmergency': ['notifications', 'emergency'],
            'notifCommunity': ['notifications', 'community'],
            'allowTracking': ['location', 'allowTracking'],
            'shareLocation': ['privacy', 'shareLocation'],
            'shareReports': ['privacy', 'shareReports'],
            'analytics': ['privacy', 'analytics'],
            'highContrast': ['accessibility', 'highContrast'],
            'largeText': ['accessibility', 'largeText'],
            'screenReader': ['accessibility', 'screenReader'],
            'reducedMotion': ['accessibility', 'reducedMotion']
        };

        const mapping = categoryMap[key];
        if (mapping) {
            const [category, property] = mapping;
            this.preferences[category][property] = value;
            
            // Aplicar mudanças imediatamente
            this.applyAccessibilitySettings();
        }
    }

    saveProfileData() {
        try {
            // Coletar dados do formulário
            const formData = {
                name: document.getElementById('profileName').value,
                email: document.getElementById('profileEmail').value,
                phone: document.getElementById('profilePhone').value,
                bio: document.getElementById('profileBio').value,
                updatedAt: new Date().toISOString()
            };

            // Coletar endereços
            this.preferences.location.homeAddress = document.getElementById('homeAddress').value;
            this.preferences.location.workAddress = document.getElementById('workAddress').value;

            this.profileData = { ...this.profileData, ...formData };
            
            if (this.saveUserData()) {
                this.showNotification('Perfil atualizado com sucesso!', 'success');
                this.hideProfileModal();
            } else {
                this.showNotification('Erro ao salvar perfil. Tente novamente.', 'error');
            }
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            this.showNotification('Erro ao salvar perfil. Tente novamente.', 'error');
        }
    }

    applyAccessibilitySettings() {
        const body = document.body;
        
        // Alto contraste
        if (this.preferences.accessibility.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }

        // Texto grande
        if (this.preferences.accessibility.largeText) {
            body.classList.add('large-text');
        } else {
            body.classList.remove('large-text');
        }

        // Reduzir animações
        if (this.preferences.accessibility.reducedMotion) {
            body.classList.add('reduced-motion');
        } else {
            body.classList.remove('reduced-motion');
        }
    }

    updateLocation(position) {
        if (this.preferences.location.allowTracking) {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date().toISOString()
            };

            // Emitir evento de localização atualizada
            document.dispatchEvent(new CustomEvent('location-updated', {
                detail: location
            }));
        }
    }

    exportUserData() {
        try {
            const userData = {
                profile: this.profileData,
                preferences: this.preferences,
                exportDate: new Date().toISOString()
            };

            const dataStr = JSON.stringify(userData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `alertavia-dados-${Date.now()}.json`;
            link.click();

            this.showNotification('Dados exportados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            this.showNotification('Erro ao exportar dados.', 'error');
        }
    }

    showDeleteConfirmation() {
        const confirmed = confirm(
            'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.\n\n' +
            'Todos os seus dados serão permanentemente removidos.'
        );

        if (confirmed) {
            this.deleteAccount();
        }
    }

    async deleteAccount() {
        try {
            // Em produção, enviar requisição para o servidor
            // await fetch('/api/user/delete', { method: 'DELETE' });

            // Limpar dados locais
            localStorage.removeItem('alertavia_user');
            localStorage.removeItem('alertavia_profile');
            localStorage.removeItem('alertavia_preferences');
            localStorage.removeItem('alertavia_token');

            this.showNotification('Conta excluída com sucesso.', 'success');
            
            // Redirecionar após delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Erro ao excluir conta:', error);
            this.showNotification('Erro ao excluir conta. Tente novamente.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Usar o sistema de notificações existente
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // Getters para acesso às preferências
    getPreferences() {
        return this.preferences;
    }

    getProfile() {
        return this.profileData;
    }

    // Método para atualizar preferências programaticamente
    updatePreferences(newPreferences) {
        this.preferences = { ...this.preferences, ...newPreferences };
        this.saveUserData();
        this.applyAccessibilitySettings();
    }
}

// Instanciar o gerenciador de perfil quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.userProfile = new UserProfile();
});
