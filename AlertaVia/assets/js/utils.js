// AlertaVia - Utilitários e Funções Auxiliares
class AlertaViaUtils {
    
    // ===== UTILITÁRIOS DE DOM ===== //
    static $(selector) {
        return document.querySelector(selector);
    }

    static $$(selector) {
        return document.querySelectorAll(selector);
    }

    static createElement(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static addClass(element, className) {
        if (element) element.classList.add(className);
    }

    static removeClass(element, className) {
        if (element) element.classList.remove(className);
    }

    static toggleClass(element, className) {
        if (element) element.classList.toggle(className);
    }

    static hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    }

    // ===== UTILITÁRIOS DE DADOS ===== //
    static formatDate(date, format = 'DD/MM/YYYY') {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    }

    static formatTime(date) {
        const d = new Date(date);
        return d.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    static formatDistance(meters) {
        if (meters < 1000) {
            return `${Math.round(meters)}m`;
        }
        return `${(meters / 1000).toFixed(1)}km`;
    }

    static formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        }
        return `${minutes}min`;
    }

    // ===== UTILITÁRIOS DE VALIDAÇÃO ===== //
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    }

    static sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // ===== UTILITÁRIOS DE STORAGE ===== //
    static setStorage(key, value, type = 'local') {
        try {
            const storage = type === 'session' ? sessionStorage : localStorage;
            storage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Erro ao salvar no storage:', error);
        }
    }

    static getStorage(key, defaultValue = null, type = 'local') {
        try {
            const storage = type === 'session' ? sessionStorage : localStorage;
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Erro ao ler do storage:', error);
            return defaultValue;
        }
    }

    static removeStorage(key, type = 'local') {
        try {
            const storage = type === 'session' ? sessionStorage : localStorage;
            storage.removeItem(key);
        } catch (error) {
            console.warn('Erro ao remover do storage:', error);
        }
    }

    // ===== UTILITÁRIOS DE REDE ===== //
    static async fetchWithTimeout(url, options = {}, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    static async get(url, options = {}) {
        return this.fetchWithTimeout(url, { method: 'GET', ...options });
    }

    static async post(url, data, options = {}) {
        return this.fetchWithTimeout(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: JSON.stringify(data),
            ...options
        });
    }

    // ===== UTILITÁRIOS DE PERFORMANCE ===== //
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static memoize(func) {
        const cache = new Map();
        return function(...args) {
            const key = JSON.stringify(args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func.apply(this, args);
            cache.set(key, result);
            return result;
        };
    }

    // ===== UTILITÁRIOS DE DISPOSITIVO ===== //
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isTablet() {
        return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent);
    }

    static isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }

    static getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    static isRetina() {
        return window.devicePixelRatio > 1;
    }

    // ===== UTILITÁRIOS DE COORDENADAS ===== //
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distância em km
    }

    static deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    // ===== UTILITÁRIOS DE RANDOM ===== //
    static generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    static randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ===== UTILITÁRIOS DE URL ===== //
    static getUrlParams() {
        return new URLSearchParams(window.location.search);
    }

    static updateUrlParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, '', url);
    }

    static removeUrlParam(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.replaceState({}, '', url);
    }
}

// Exportar classe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlertaViaUtils;
} else {
    window.AlertaViaUtils = AlertaViaUtils;
}
