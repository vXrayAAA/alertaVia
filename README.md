# 🚨 AlertaVia - Mobilidade Inteligente

<div align="center">

![AlertaVia Logo](assets/images/logo.png)

**Plataforma inovadora para mobilidade urbana segura em Recife**

[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)](https://github.com/AlertaVia/alertavia)
[![Version](https://img.shields.io/badge/Version-2.0.0-blue)](https://github.com/AlertaVia/alertavia)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![FIAP](https://img.shields.io/badge/FIAP-Global%20Solution-red)](https://www.fiap.com.br)

[🌟 Demo](https://alertavia.github.io/alertavia) • [📖 Documentação](docs/) • [🐛 Reportar Bug](https://github.com/AlertaVia/alertavia/issues) • [💡 Sugerir Feature](https://github.com/AlertaVia/alertavia/issues)

</div>

---

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [👥 Equipe](#-equipe)
- [🏗️ Arquitetura](#️-arquitetura)
- [🚀 Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [📦 Instalação](#-instalação)
- [🔧 Uso](#-uso)
- [🐛 Bugs Conhecidos](#-bugs-conhecidos)
- [📊 Roadmap](#-roadmap)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **AlertaVia** é uma plataforma inovadora de mobilidade inteligente desenvolvida para enfrentar os desafios de trânsito e segurança viária em Recife. Nossa solução integra dados em tempo real, análise preditiva e colaboração cidadã para criar rotas mais seguras e eficientes.

### 🌟 Visão
Transformar a mobilidade urbana através da tecnologia, criando um ecossistema inteligente que reduz acidentes, otimiza fluxos de trânsito e melhora a qualidade de vida dos cidadãos.

### 🎯 Missão
Desenvolver uma plataforma colaborativa que utiliza inteligência artificial e dados em tempo real para proporcionar navegação segura e eficiente na região metropolitana do Recife.

### 🗄️ Banco de Dados Completo
O AlertaVia conta com um **Modelo Entidade-Relacionamento (MER)** robusto e escalável:
- **14 tabelas principais** otimizadas para performance
- **Sistema geoespacial** com precisão de ~1 metro
- **Analytics avançados** com dashboards executivos
- **Automação completa** via procedures e triggers
- **Auditoria total** para compliance LGPD



---

## 👥 Equipe

### 🎓 Equipe FIAP - Global Solution 2025

| Nome | RM | Função | LinkedIn | E-mail |
|------|----|---------|-----------| -------|
| **[Nome do Líder]** | RM[XXXXX] | 👑 Project Manager & Full-Stack Developer | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-blue?logo=linkedin)](https://linkedin.com/in/[profile]) | [email@exemplo.com](mailto:email@exemplo.com) |
| **[Nome do Desenvolvedor 1]** | RM[XXXXX] | 💻 Frontend Developer & UI/UX Designer | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-blue?logo=linkedin)](https://linkedin.com/in/[profile]) | [email@exemplo.com](mailto:email@exemplo.com) |
| **[Nome do Desenvolvedor 2]** | RM[XXXXX] | 🔧 Backend Developer & DevOps | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-blue?logo=linkedin)](https://linkedin.com/in/[profile]) | [email@exemplo.com](mailto:email@exemplo.com) |
| **[Nome do Analista]** | RM[XXXXX] | 📊 Data Analyst & QA Tester | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-blue?logo=linkedin)](https://linkedin.com/in/[profile]) | [email@exemplo.com](mailto:email@exemplo.com) |
| **[Nome do Designer]** | RM[XXXXX] | 🎨 UX/UI Designer & Mobile Developer | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-blue?logo=linkedin)](https://linkedin.com/in/[profile]) | [email@exemplo.com](mailto:email@exemplo.com) |

> **📝 Nota:** Atualize os nomes, RMs e informações de contato da sua equipe nos campos acima.

---




### 🏛️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (PWA)                       │
├─────────────────────────────────────────────────────────┤
│  Landing Page  │  Mapa Interativo  │  App Mobile       │
│  - HTML5       │  - Leaflet.js      │  - Service Worker │
│  - CSS3        │  - WebGL           │  - Cache Offline  │
│  - JavaScript │  - Geolocation     │  - Push Notif.    │
└─────────────────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │   (REST API)    │
                    └────────┬────────┘
                             │
┌─────────────────────────────▼─────────────────────────────┐
│                   BACKEND SERVICES                       │
├─────────────────────────────────────────────────────────┤
│  User Service   │  Report Service  │  Route Service      │
│  - Auth         │  - CRUD Reports  │  - Path Calculation │
│  - Profile      │  - Validation    │  - AI Optimization  │
│  - Preferences  │  - Media Upload  │  - Traffic Analysis │
└─────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────▼─────────────────────────────┐
│                   DATA LAYER                             │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL     │  Redis Cache     │  Object Storage     │
│  - User Data    │  - Session       │  - Images/Videos    │
│  - Reports      │  - Temp Data     │  - Static Assets    │
│  - Routes       │  - API Cache     │  - Backups          │
└─────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────▼─────────────────────────────┐
│                EXTERNAL INTEGRATIONS                     │
├─────────────────────────────────────────────────────────┤
│  Weather API    │  Traffic API     │  Maps API           │
│  - Conditions   │  - Real-time     │  - Geocoding        │
│  - Forecasts    │  - Incidents     │  - Routing          │
│  - Alerts       │  - Road Status   │  - Places           │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Funcionalidades

### ✅ Implementadas (v2.0.0)

- **🗺️ Mapa Interativo**
  - Visualização em tempo real de incidentes
  - Marcadores personalizados por tipo de evento
  - Filtros por categoria (alagamentos, acidentes, obras)
  - Controles de zoom e navegação

- **📱 Interface Responsiva**
  - Design moderno e intuitivo
  - Compatibilidade com dispositivos móveis
  - Tema claro/escuro
  - Animações suaves

- **📊 Dashboard de Dados**
  - Estatísticas em tempo real
  - Gráficos interativos
  - Relatórios de performance
  - Métricas de uso

- **🔄 Sistema de Relatórios**
  - Criação de novos incidentes
  - Upload de imagens
  - Confirmação colaborativa
  - Histórico de atividades

### 🚧 Em Desenvolvimento

- **🤖 Inteligência Artificial**
  - Análise preditiva de tráfego
  - Detecção automática de padrões
  - Recomendações personalizadas
  - Machine Learning para otimização

- **🔔 Sistema de Notificações**
  - Push notifications
  - Alertas por localização
  - Notificações personalizadas
  - E-mail e SMS

- **👤 Perfil de Usuário**
  - Cadastro e autenticação
  - Histórico pessoal
  - Preferências de rota
  - Gamificação

### 📋 Roadmap

- **🌐 API Pública** (Q3 2025)
- **📱 App Native Mobile** (Q4 2025)
- **🏢 Painel Administrativo** (Q1 2026)
- **🔗 Integração IoT** (Q2 2026)

---

## 🛠️ Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização avançada com Grid/Flexbox
- **JavaScript ES6+** - Lógica interativa
- **Leaflet.js** - Mapas interativos
- **Chart.js** - Gráficos e visualizações
- **Service Worker** - Funcionalidades offline

### APIs e Integrações
- **OpenWeatherMap** - Dados meteorológicos
- **OpenStreetMap** - Dados cartográficos
- **Nominatim** - Geocodificação
- **OSRM** - Cálculo de rotas

### Ferramentas de Desenvolvimento
- **Git** - Controle de versão
- **VS Code** - Editor de código
- **Live Server** - Servidor de desenvolvimento
- **GitHub Pages** - Hospedagem estática

---

## 📦 Instalação

### 📋 Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **Git** (versão 2.0 ou superior)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### 🚀 Instalação Rápida

```powershell
# Clone o repositório
git clone https://github.com/AlertaVia/alertavia.git

# Entre no diretório
cd alertavia

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### 🌐 Acesso Local

Após executar `npm start`, acesse:
- **Landing Page:** http://localhost:8000
- **Mapa Interativo:** http://localhost:8000/mapa.html
- **Testes:** http://localhost:8000/teste-essenciais.html

---

## 🔧 Uso

### 🗺️ Navegação no Mapa

1. **Visualizar Incidentes:**
   - Abra o mapa interativo
   - Use os filtros laterais para categorias específicas
   - Clique nos marcadores para mais informações

2. **Reportar Incidente:**
   - Clique no botão "Reportar Incidente"
   - Selecione a localização no mapa
   - Preencha o formulário com detalhes
   - Adicione fotos se necessário

3. **Buscar Rotas:**
   - Defina origem e destino
   - Escolha preferências (rápida/segura)
   - Visualize alternativas no mapa

### 📱 Uso Mobile

O AlertaVia é um PWA (Progressive Web App):
- **Instalação:** Use "Adicionar à tela inicial"
- **Offline:** Funciona sem conexão limitada
- **Notificações:** Receba alertas automáticos

---

## 🐛 Bugs Conhecidos

### 🔴 Críticos
- [ ] **Widget meteorológico não atualiza** (Em correção)
  - **Status:** 🔄 Investigando
  - **Impacto:** Médio
  - **ETA:** Esta semana

### 🟡 Médios
- [ ] **Mapa lento em dispositivos antigos**
  - **Status:** 📋 Planejado
  - **Impacto:** Baixo
  - **ETA:** Próxima versão

- [ ] **Notificações não funcionam no Safari**
  - **Status:** 🔍 Investigando
  - **Impacto:** Médio
  - **ETA:** Em análise

### 🟢 Melhorias
- [ ] **Interface do painel lateral**
  - **Status:** 🎨 Design
  - **Impacto:** Baixo
  - **ETA:** Futuro

- [ ] **Performance em mapas com muitos marcadores**
  - **Status:** 📋 Planejado
  - **Impacto:** Médio
  - **ETA:** v2.1

### 📊 Manutenção Necessária

#### 🔧 Correções de UI/UX
- **Responsividade em tablets** - Ajustar layout para telas médias
- **Contraste de cores** - Melhorar acessibilidade
- **Animações de transição** - Suavizar mudanças de estado
- **Feedback visual** - Indicadores de carregamento

#### 🛠️ Correções Técnicas
- **Cache de API** - Implementar estratégia de cache mais robusta
- **Error Handling** - Melhorar tratamento de erros
- **Memory Leaks** - Otimizar gerenciamento de memória
- **SEO** - Melhorar meta tags e estrutura

---

## 📊 Roadmap

### 🎯 Versão 2.1 (Q3 2025)
- ✅ Correção de bugs críticos
- ✅ Otimização de performance
- 🔲 Sistema de autenticação
- 🔲 Notificações push

### 🎯 Versão 2.2 (Q4 2025)
- 🔲 API pública REST
- 🔲 Integração com redes sociais
- 🔲 Análise de dados avançada
- 🔲 App mobile nativo

### 🎯 Versão 3.0 (Q1 2026)
- 🔲 Inteligência artificial
- 🔲 Previsão de tráfego
- 🔲 Integração IoT
- 🔲 Painel administrativo

---

## 🤝 Contribuindo

Adoramos contribuições! Veja como você pode ajudar:

### 🐛 Reportar Bugs
1. Verifique se o bug já foi reportado
2. Abra uma [issue](https://github.com/AlertaVia/alertavia/issues)
3. Use o template de bug report
4. Inclua prints e passos para reproduzir

### 💡 Sugerir Features
1. Abra uma [issue](https://github.com/AlertaVia/alertavia/issues)
2. Use o template de feature request
3. Descreva o caso de uso
4. Proponha uma solução

### 🔧 Contribuir com Código
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### 📝 Padrões de Commit
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação, sem mudança de lógica
refactor: refatoração de código
test: adição ou correção de testes
chore: atualizações de build, dependências
```

---

## 📊 Estatísticas do Projeto

![GitHub Stars](https://img.shields.io/github/stars/AlertaVia/alertavia?style=social)
![GitHub Forks](https://img.shields.io/github/forks/AlertaVia/alertavia?style=social)
![GitHub Issues](https://img.shields.io/github/issues/AlertaVia/alertavia)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/AlertaVia/alertavia)

### 📈 Métricas de Desenvolvimento
- **Linhas de Código:** ~5,000+
- **Arquivos:** 50+
- **Commits:** 100+
- **Branches:** 5+

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2025 AlertaVia Team - FIAP

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software")...
```

---

## 🙏 Agradecimentos

- **FIAP** - Instituição de ensino e orientação
- **OpenStreetMap** - Dados cartográficos gratuitos
- **Leaflet** - Biblioteca de mapas open source
- **Comunidade Open Source** - Inspiração e ferramentas

---

## 📞 Contato

- **Website:** [alertavia.github.io](https://alertavia.github.io)
- **E-mail:** contato@alertavia.com.br
- **GitHub:** [@AlertaVia](https://github.com/AlertaVia)
- **LinkedIn:** [AlertaVia](https://linkedin.com/company/alertavia)

---

<div align="center">

**Feito com ❤️ pela equipe AlertaVia**

*Transformando a mobilidade urbana através da tecnologia*

</div>
