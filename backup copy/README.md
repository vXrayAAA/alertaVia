# AlertaVia - Landing Page

Uma landing page moderna e responsiva para o AlertaVia, plataforma de mobilidade inteligente que ajuda usuários a evitar alagamentos e encontrar rotas seguras em Recife e região.

## 🚀 Características

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Performance Otimizada**: Carregamento rápido e experiência fluida
- **Acessibilidade**: Seguindo as melhores práticas de acessibilidade
- **PWA Ready**: Configurado como Progressive Web App
- **Animações Suaves**: Transições e efeitos visuais modernos

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Flexbox, Grid, Custom Properties e animações
- **JavaScript ES6+**: Funcionalidades interativas e dinâmicas
- **Font Awesome**: Ícones vetoriais
- **Google Fonts**: Tipografia Inter
- **Service Worker**: Cache e funcionalidade offline

## 📱 Funcionalidades

### Principais Seções
- **Header Navegável**: Menu responsivo com dropdowns
- **Hero Section**: Apresentação principal com CTAs
- **Mapa em Tempo Real**: Acesso rápido ao mapa interativo
- **Alertas da Comunidade**: Sistema de notificações colaborativo
- **Chat Localizado**: Comunicação baseada em localização
- **Formulário de Contato**: Sistema de mensagens
- **Footer Completo**: Links úteis e redes sociais

### Recursos Técnicos
- **Lazy Loading**: Carregamento otimizado de imagens
- **Smooth Scrolling**: Navegação suave entre seções
- **Modal Dinâmico**: Pop-ups para interações
- **Sistema de Notificações**: Feedback visual para ações
- **Analytics Tracking**: Rastreamento de eventos
- **Debounced Events**: Performance otimizada

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
├── index.html          # Estrutura principal HTML
├── styles.css          # Estilos CSS
├── script.js           # JavaScript interativo
├── sw.js              # Service Worker
└── README.md          # Documentação
```

## 🚀 Como Usar

1. **Clone ou baixe os arquivos**
2. **Abra o arquivo `index.html` em um navegador**
3. **Para desenvolvimento local com servidor**:
   ```bash
   # Com Python
   python -m http.server 8000
   
   # Com Node.js (http-server)
   npx http-server
   
   # Com Live Server (VS Code)
   # Instale a extensão Live Server e clique em "Go Live"
   ```

## 📱 Responsividade

A landing page é totalmente responsiva com breakpoints:
- **Desktop**: > 768px
- **Tablet**: 768px - 481px
- **Mobile**: ≤ 480px

## ⚡ Performance

- **Otimizações implementadas**:
  - Lazy loading de imagens
  - Debounce em eventos de scroll
  - Minificação de recursos
  - Cache via Service Worker
  - Fonts otimizadas
  - CSS Grid e Flexbox para layouts eficientes

## 🔧 Personalização

### Modificar Cores
Edite as custom properties CSS em `:root` no arquivo `styles.css`:

```css
:root {
    --primary-color: #3B82F6;
    --secondary-color: #10B981;
    /* ... outras variáveis */
}
```

### Adicionar Seções
1. Adicione o HTML na estrutura desejada
2. Crie os estilos correspondentes no CSS
3. Implemente a funcionalidade no JavaScript se necessário

### Integrar APIs
- **Mapa**: Substitua as funções de exemplo por integração real (Google Maps, Mapbox, etc.)
- **Formulário**: Configure envio para seu backend
- **Analytics**: Integre Google Analytics, Hotjar, etc.

## 🌟 Melhorias Futuras

- [ ] Integração com API de mapas real
- [ ] Sistema de autenticação
- [ ] Chat em tempo real
- [ ] Push notifications
- [ ] Modo escuro
- [ ] Múltiplos idiomas
- [ ] Integração com redes sociais
- [ ] Blog/Notícias
- [ ] Dashboard administrativo

## 📞 Suporte

Para dúvidas ou sugestões sobre esta landing page:
- **Email**: dev@alertavia.com.br
- **GitHub**: [Repositório do projeto]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**AlertaVia** - Mobilidade inteligente para um trânsito mais seguro 🚗💙
