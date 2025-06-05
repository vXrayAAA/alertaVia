// Script de Diagnóstico AlertaVia
// Execute este script no console do navegador para verificar o status

console.log('🔍 DIAGNÓSTICO ALERTAVIA - INICIANDO...');
console.log('===============================================');

// 1. Verificar se os elementos DOM existem
console.log('\n📋 1. VERIFICAÇÃO DE ELEMENTOS DOM:');
const elements = {
    'weather-temp': document.getElementById('weather-temp'),
    'weather-condition': document.getElementById('weather-condition'),
    'weather-humidity': document.getElementById('weather-humidity'),
    'weather-icon': document.getElementById('weather-icon'),
    'connection-status': document.getElementById('connection-status')
};

Object.entries(elements).forEach(([id, element]) => {
    if (element) {
        console.log(`✅ ${id}: ENCONTRADO - "${element.textContent || element.innerHTML}"`);
    } else {
        console.log(`❌ ${id}: NÃO ENCONTRADO`);
    }
});

// 2. Verificar se as classes JavaScript estão carregadas
console.log('\n🔧 2. VERIFICAÇÃO DE CLASSES:');
const classes = {
    'APIService': typeof APIService !== 'undefined' ? APIService : null,
    'AlertaViaMapFixed': typeof AlertaViaMapFixed !== 'undefined' ? AlertaViaMapFixed : null,
    'window.alertaViaMap': window.alertaViaMap || null
};

Object.entries(classes).forEach(([name, cls]) => {
    if (cls) {
        console.log(`✅ ${name}: CARREGADO`);
        if (name === 'window.alertaViaMap' && cls) {
            console.log(`   - Inicializado: ${cls.isInitialized ? 'SIM' : 'NÃO'}`);
            console.log(`   - API Service: ${cls.apiService ? 'DISPONÍVEL' : 'NÃO DISPONÍVEL'}`);
        }
    } else {
        console.log(`❌ ${name}: NÃO CARREGADO`);
    }
});

// 3. Verificar funções específicas
console.log('\n⚙️ 3. VERIFICAÇÃO DE FUNÇÕES:');
if (window.alertaViaMap) {
    const functions = [
        'displayWeatherInfo',
        'updateServerStatus',
        'initializeWeather'
    ];
    
    functions.forEach(fn => {
        if (typeof window.alertaViaMap[fn] === 'function') {
            console.log(`✅ ${fn}: DISPONÍVEL`);
        } else {
            console.log(`❌ ${fn}: NÃO DISPONÍVEL`);
        }
    });
} else {
    console.log('❌ window.alertaViaMap não está disponível');
}

// 4. Testar API Service
console.log('\n🌐 4. TESTE API SERVICE:');
if (typeof APIService !== 'undefined') {
    try {
        const apiTest = new APIService();
        console.log('✅ APIService instanciado com sucesso');
        
        // Testar dados meteorológicos
        apiTest.getWeatherData().then(data => {
            console.log('✅ Dados meteorológicos obtidos:', data);
        }).catch(err => {
            console.log('❌ Erro ao obter dados meteorológicos:', err);
        });
        
        console.log(`📡 Status atual do servidor: ${apiTest.serverStatus}`);
    } catch (err) {
        console.log('❌ Erro ao instanciar APIService:', err);
    }
} else {
    console.log('❌ APIService não está carregado');
}

// 5. Executar testes manuais
console.log('\n🧪 5. EXECUTANDO TESTES MANUAIS:');

// Teste de atualização meteorológica
if (window.alertaViaMap && typeof window.alertaViaMap.displayWeatherInfo === 'function') {
    console.log('🌤️ Testando displayWeatherInfo...');
    window.alertaViaMap.displayWeatherInfo({
        temperature: 25,
        condition: 'Teste Manual',
        humidity: 70,
        icon: 'fas fa-sun'
    });
    console.log('✅ displayWeatherInfo executado');
} else {
    console.log('❌ Não foi possível testar displayWeatherInfo');
}

// Teste de status de conexão
if (window.alertaViaMap && typeof window.alertaViaMap.updateServerStatus === 'function') {
    console.log('📡 Testando updateServerStatus...');
    window.alertaViaMap.updateServerStatus('online');
    console.log('✅ updateServerStatus executado');
} else {
    console.log('❌ Não foi possível testar updateServerStatus');
}

console.log('\n===============================================');
console.log('🔍 DIAGNÓSTICO CONCLUÍDO');
console.log('===============================================');

// Função helper para executar novamente
window.runDiagnostic = () => {
    console.clear();
    // Re-executar este script
    eval(document.getElementById('diagnostic-script').textContent);
};

console.log('\n💡 Para executar novamente: runDiagnostic()');
