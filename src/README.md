# AlertaVia - Plataforma de Mobilidade Inteligente

Uma aplicação web completa para o AlertaVia, plataforma de mobilidade inteligente que ajuda usuários a evitar alagamentos e encontrar rotas seguras em Recife e região. O projeto inclui uma landing page moderna e um sistema de mapas interativo com funcionalidades avançadas.

## 🚀 Características

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Mapa Interativo**: Sistema completo de mapas com Leaflet.js
- **Integração de APIs**: Serviços de clima, trânsito e geocodificação
- **Tempo Real**: Dados atualizados em tempo real
- **Notificações Push**: Sistema de alertas baseado em localização
- **PWA Ready**: Configurado como Progressive Web App
- **Performance Otimizada**: Carregamento rápido e experiência fluida
- **Acessibilidade**: Seguindo as melhores práticas de acessibilidade
- **Animações Suaves**: Transições e efeitos visuais modernos

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Flexbox, Grid, Custom Properties e animações
- **JavaScript ES6+**: Funcionalidades interativas e dinâmicas
- **Leaflet.js**: Biblioteca de mapas interativos
- **APIs Externas**: Integração com serviços de clima e trânsito
- **Font Awesome**: Ícones vetoriais
- **Google Fonts**: Tipografia Inter
- **Service Worker**: Cache e funcionalidade offline
- **PWA Manifest**: Instalação como aplicativo nativo

## 📱 Funcionalidades

### Landing Page
- **Header Navegável**: Menu responsivo com dropdowns
- **Hero Section**: Apresentação principal com CTAs
- **Seções de Recursos**: Mapa em tempo real, alertas da comunidade, chat localizado
- **Formulário de Contato**: Sistema de mensagens com validação
- **Footer Completo**: Links úteis e redes sociais

### Sistema de Mapas Interativo
- **Mapa Dinâmico**: Visualização interativa com Leaflet.js
- **Controles Avançados**: Zoom, camadas, filtros e busca
- **Alertas em Tempo Real**: Marcadores de alagamentos e incidentes
- **Geocodificação**: Busca de endereços e localizações
- **Cálculo de Rotas**: Rotas alternativas evitando áreas de risco
- **Sistema de Relatórios**: Envio de incidentes pela comunidade
- **Dados Meteorológicos**: Integração com APIs de clima
- **Informações de Trânsito**: Status em tempo real das vias

### Recursos Técnicos
- **API Service**: Camada de integração com serviços externos
- **Notificações Push**: Alertas baseados em localização
- **Cache Inteligente**: Armazenamento offline de dados críticos
- **Lazy Loading**: Carregamento otimizado de recursos
- **Smooth Scrolling**: Navegação suave entre seções
- **Modal Dinâmico**: Pop-ups para interações
- **Sistema de Feedback**: Respostas visuais para ações do usuário
- **Analytics Tracking**: Rastreamento de eventos e interações
- **Debounced Events**: Performance otimizada em eventos frequentes

## 🎨 Design System

### Cores Principais
- **Primary**: #3B82F6 (Azul)
- **Secondary**: #10B981 (Verde)
- **Accent**: #F59E0B (Amarelo)
- **Text Primary**: #1F2937 (Cinza escuro)
- **Background**: #FFFFFF (Branco)

### Tipografia
- **Família**: Inter
- **Pesos**: 300, 400, 500, 600, 700

### Espaçamento
- Sistema baseado em múltiplos de 0.25rem
- Grid responsivo com breakpoints em 768px e 480px

## 📁 Estrutura de Arquivos

```
Landing-page/
├── index.html          # Landing page principal
├── mapa.html          # Página do mapa interativo
├── styles.css         # Estilos da landing page
├── map-styles.css     # Estilos específicos do mapa
├── script.js          # JavaScript da landing page
├── map-script.js      # JavaScript do sistema de mapas
├── api-service.js     # Serviços de integração com APIs
├── sw.js             # Service Worker para PWA
├── manifest.json     # Manifesto PWA
├── package.json      # Dependências e scripts
├── .gitignore        # Arquivos ignorados pelo Git
└── README.md         # Documentação do projeto
```

## 🚀 Como Usar

### Instalação

1. **Clone ou baixe os arquivos**
2. **Instale as dependências**:
   ```bash
   npm install
   ```

### Desenvolvimento

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   # Usando npm scripts
   npm start          # http-server na porta 8000
   npm run dev       # live-server com reload automático
   
   # Usando Python
   python -m http.server 8000
   
   # Usando Node.js diretamente
   npx http-server
   ```

4. **Acesse a aplicação**:
   - Landing page: `http://localhost:8000/index.html`
   - Mapa interativo: `http://localhost:8000/mapa.html`

### Build e Deploy

5. **Prepare para produção**:
   ```bash
   npm run build     # Processo de build
   npm run lint      # Verificação de código
   npm run test      # Execução de testes
   ```

## 📱 Responsividade

A landing page é totalmente responsiva com breakpoints:
- **Desktop**: > 768px
- **Tablet**: 768px - 481px
- **Mobile**: ≤ 480px

## ⚡ Performance

- **Otimizações implementadas**:
  - Lazy loading de imagens e recursos
  - Debounce em eventos de scroll e busca
  - Cache inteligente via Service Worker
  - Carregamento assíncrono de APIs
  - Fonts otimizadas com preconnect
  - CSS Grid e Flexbox para layouts eficientes
  - Minificação de recursos em produção
  - Compressão de dados de mapas
  - Throttling de requisições de API
  - Pré-carregamento de dados críticos

## 🗺️ Sistema de Mapas

### Recursos do Mapa
- **Base Maps**: OpenStreetMap com temas customizáveis
- **Marcadores Dinâmicos**: Incidentes, alertas e pontos de interesse
- **Controles Interativos**: Zoom, busca, filtros e camadas
- **Dados em Tempo Real**: Atualizações automáticas de incidentes
- **Geolocalização**: Detecção automática da posição do usuário

### APIs Integradas
- **Serviço Meteorológico**: Dados de clima e precipitação
- **Informações de Trânsito**: Status das vias em tempo real
- **Geocodificação**: Conversão de endereços em coordenadas
- **Cálculo de Rotas**: Algoritmos para rotas alternativas
- **Notificações**: Sistema de alertas baseado em localização

### Funcionalidades Avançadas
- **Filtros Inteligentes**: Por tipo de incidente, gravidade e data
- **Busca Geográfica**: Localização por endereço ou ponto de referência
- **Relatórios da Comunidade**: Envio de novos incidentes
- **Histórico de Dados**: Visualização de tendências temporais
- **Análise de Rotas**: Comparação de opções de trajeto

## 🔧 Personalização

### Modificar Cores
Edite as custom properties CSS em `:root` nos arquivos CSS:

```css
/* styles.css e map-styles.css */
:root {
    --primary-color: #3B82F6;
    --secondary-color: #10B981;
    --accent-color: #F59E0B;
    --danger-color: #EF4444;
    --warning-color: #F59E0B;
    --success-color: #10B981;
    /* ... outras variáveis */
}
```

### Configurar APIs
Configure as integrações no arquivo `api-service.js`:

```javascript
// Configuração de APIs externas
const API_CONFIG = {
    weather: {
        provider: 'OpenWeatherMap',
        key: 'sua-api-key'
    },
    geocoding: {
        provider: 'Nominatim',
        endpoint: 'https://nominatim.openstreetmap.org'
    },
    routing: {
        provider: 'OSRM',
        endpoint: 'https://router.project-osrm.org'
    }
};
```

### Adicionar Funcionalidades
1. **Novas Seções**: Adicione HTML e implemente no CSS/JS correspondente
2. **Novos Tipos de Alertas**: Estenda o sistema de notificações
3. **Filtros Customizados**: Adicione novos critérios de filtro no mapa
4. **Integração Backend**: Configure endpoints reais para persistência

### Customizar Mapa
- **Estilos de Mapa**: Modifique os tiles e temas visuais
- **Marcadores**: Crie novos tipos de marcadores e ícones
- **Controles**: Adicione novos controles interativos
- **Camadas**: Implemente novas camadas de dados

## 🌟 Melhorias Futuras

### Funcionalidades Pendentes
- [ ] Autenticação de usuários e perfis
- [ ] Backend real com banco de dados
- [ ] Integração com Google Analytics
- [ ] Modo escuro/claro automático
- [ ] Testes unitários e de integração
- [ ] Integração com APIs reais de clima
- [ ] Sistema de admin para gestão de incidentes
- [ ] Chat em tempo real entre usuários
- [ ] Histórico detalhado de rotas
- [ ] Múltiplos idiomas (i18n)

### Melhorias Técnicas
- [ ] Migration para TypeScript
- [ ] Bundle otimizado com Webpack/Vite
- [ ] CI/CD automatizado
- [ ] Monitoramento de performance
- [ ] Logs centralizados
- [ ] Testes E2E automatizados
- [ ] Documentação de API
- [ ] Containerização com Docker
- [ ] Deploy em cloud (AWS/Azure/GCP)
- [ ] CDN para assets estáticos

### Recursos Avançados
- [ ] Machine Learning para predição de alagamentos
- [ ] Integração com IoT sensors
- [ ] AR/VR para visualização imersiva
- [ ] App mobile nativo
- [ ] Wearables integration
- [ ] Voice commands
- [ ] Blockchain para validação de dados
- [ ] API pública para desenvolvedores
- [ ] Marketplace de plugins
- [ ] Gamificação do sistema

## 📞 Suporte

Para dúvidas ou sugestões sobre esta landing page:
- **Email**: dev@alertavia.com.br
- **GitHub**: [Repositório do projeto]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**AlertaVia** - Mobilidade inteligente para um trânsito mais seguro 🚗💙
