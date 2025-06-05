# 🤝 Contribuindo para o AlertaVia

Obrigado por considerar contribuir para o AlertaVia! Este documento fornece diretrizes para contribuições.

## 📋 Índice

- [🚀 Como Começar](#-como-começar)
- [💻 Configuração do Ambiente](#-configuração-do-ambiente)
- [🔄 Processo de Contribuição](#-processo-de-contribuição)
- [📝 Padrões de Código](#-padrões-de-código)
- [🧪 Testes](#-testes)
- [📚 Documentação](#-documentação)
- [🐛 Reportando Bugs](#-reportando-bugs)
- [💡 Sugerindo Features](#-sugerindo-features)
- [👥 Código de Conduta](#-código-de-conduta)

---

## 🚀 Como Começar

### Pré-requisitos
- Git instalado
- Node.js 16+ e npm
- Conhecimento básico de HTML, CSS, JavaScript
- Familiaridade com Git/GitHub

### Primeiros Passos
1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Configure** o ambiente de desenvolvimento
4. **Crie** uma branch para sua feature/correção
5. **Faça** suas mudanças
6. **Teste** suas mudanças
7. **Submeta** um Pull Request

---

## 💻 Configuração do Ambiente

```bash
# 1. Clone o repositório
git clone https://github.com/[seu-usuario]/alertavia.git
cd alertavia

# 2. Configure o remote upstream
git remote add upstream https://github.com/AlertaVia/alertavia.git

# 3. Instale dependências (se houver)
npm install

# 4. Configure seu ambiente local
cp .env.example .env.local
# Edite .env.local com suas configurações

# 5. Execute o projeto localmente
npm start
# ou
python -m http.server 8000
```

---

## 🔄 Processo de Contribuição

### 1. Issues
Antes de começar, verifique se existe uma issue relacionada:
- 🐛 **Bug Reports**: Use o template de bug report
- 💡 **Feature Requests**: Use o template de feature request
- 📚 **Documentação**: Marque como documentation

### 2. Branches
Use a convenção de nomenclatura:
```
feature/nome-da-feature
bugfix/nome-do-bug
hotfix/correção-urgente
docs/atualização-documentação
```

### 3. Commits
Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição

[corpo opcional]

[rodapé(s) opcional(is)]
```

**Tipos permitidos:**
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `style`: formatação (sem mudança de lógica)
- `refactor`: refatoração de código
- `test`: testes
- `chore`: tarefas de build, CI/CD, etc.

**Exemplos:**
```bash
git commit -m "feat(map): adicionar widget meteorológico"
git commit -m "fix(api): corrigir timeout na verificação de status"
git commit -m "docs(readme): atualizar instruções de instalação"
```

### 4. Pull Requests
- Use o template de PR fornecido
- Referencie issues relacionadas
- Inclua screenshots/vídeos quando aplicável
- Certifique-se de que os testes passam
- Mantenha PRs pequenos e focados

---

## 📝 Padrões de Código

### HTML
```html
<!-- Use indentação de 2 espaços -->
<!-- IDs e classes em kebab-case -->
<div id="weather-widget" class="status-indicator">
  <span class="temperature-display">25°C</span>
</div>
```

### CSS
```css
/* Use BEM para nomenclatura de classes */
.weather-widget {
  display: flex;
  align-items: center;
}

.weather-widget__temperature {
  font-size: 1.2rem;
  font-weight: bold;
}

.weather-widget--loading {
  opacity: 0.5;
}
```

### JavaScript
```javascript
// Use camelCase para variáveis e funções
// Use PascalCase para classes e construtores
// Use UPPER_SNAKE_CASE para constantes

const API_BASE_URL = 'https://api.alertavia.com';

class WeatherService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchWeatherData(coordinates) {
    // Implementação
  }
}

function displayWeatherInfo(data) {
  // Implementação
}
```

### Comentários
```javascript
/**
 * Atualiza as informações meteorológicas no widget
 * @param {Object} weatherData - Dados meteorológicos da API
 * @param {number} weatherData.temperature - Temperatura em Celsius
 * @param {string} weatherData.condition - Condição meteorológica
 * @param {number} weatherData.humidity - Umidade em porcentagem
 */
function displayWeatherInfo(weatherData) {
  // Implementação
}
```

---

## 🧪 Testes

### Testes Manuais
1. Teste em diferentes navegadores (Chrome, Firefox, Safari, Edge)
2. Teste em dispositivos móveis
3. Verifique responsividade
4. Teste funcionalidades interativas

### Testes Automatizados
```bash
# Execute testes (quando implementados)
npm test

# Testes de linting
npm run lint

# Verificação de formatação
npm run format:check
```

### Checklist de Testes
- [ ] Funcionalidade principal funciona
- [ ] Interface responsiva
- [ ] Sem erros no console
- [ ] Performance adequada
- [ ] Acessibilidade básica
- [ ] Compatibilidade com navegadores

---

## 📚 Documentação

### Atualizando Documentação
- README.md para mudanças na configuração
- Comentários no código para funções complexas
- Documentação de API para novos endpoints
- Changelog para releases

### Padrões de Documentação
- Use Markdown para documentos
- Inclua exemplos de código
- Mantenha linguagem clara e objetiva
- Adicione screenshots quando útil

---

## 🐛 Reportando Bugs

1. **Verifique** se o bug já foi reportado
2. **Use** o template de bug report
3. **Inclua**:
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots/vídeos
   - Informações do ambiente (OS, browser, etc.)
   - Logs de erro relevantes

---

## 💡 Sugerindo Features

1. **Verifique** se a feature já foi sugerida
2. **Use** o template de feature request
3. **Explique**:
   - O problema que resolve
   - A solução proposta
   - Alternativas consideradas
   - Mockups/wireframes (se aplicável)

---

## 👥 Código de Conduta

### Nossos Compromissos
- Manter um ambiente respeitoso e inclusivo
- Aceitar feedback construtivo
- Focar no que é melhor para a comunidade
- Demonstrar empatia com outros membros

### Comportamentos Esperados
- Use linguagem acolhedora e inclusiva
- Respeite diferentes pontos de vista
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade

### Comportamentos Inaceitáveis
- Linguagem ou imagens sexualizadas
- Trolling, comentários insultuosos/depreciativos
- Assédio público ou privado
- Publicar informações privadas de outros sem permissão

---

## 📞 Contato

### Manter Comunicação
- **Issues**: Para bugs e feature requests
- **Discussions**: Para perguntas gerais
- **Email**: Para questões sensíveis ou privadas

### Resposta Esperada
- Issues: 1-3 dias úteis
- Pull Requests: 2-5 dias úteis
- Discussões: 1-2 dias úteis

---

## 🙏 Reconhecimento

Todos os contribuidores serão reconhecidos no README.md e releases notes. Contribuições de todos os tamanhos são valorizadas!

### Tipos de Contribuição
- 💻 Código
- 📚 Documentação
- 🐛 Relatórios de bugs
- 💡 Ideias e sugestões
- 🎨 Design e UI/UX
- 🧪 Testes
- 📢 Promoção e divulgação

---

**Obrigado por contribuir com o AlertaVia! Juntos estamos construindo uma mobilidade urbana mais segura e inteligente. 🚀**
