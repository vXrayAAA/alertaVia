# Estrutura do Projeto AlertaVia

## 📁 Organização dos Diretórios

```
backup/
├── index.html              # Página principal
├── package.json            # Dependências e scripts
├── .gitignore             # Arquivos ignorados pelo Git
│
├── assets/                # Recursos estáticos
│   ├── css/              # Arquivos de estilo
│   │   └── styles.css    # CSS principal com tema dark/light
│   │
│   ├── js/               # Scripts JavaScript
│   │   ├── script.js     # JavaScript principal
│   │   └── sw.js         # Service Worker para PWA
│   │
│   ├── icons/            # Ícones da aplicação (favicon, PWA icons)
│   └── images/           # Imagens e recursos visuais
│
├── config/               # Arquivos de configuração
│   └── manifest.json     # Manifest PWA
│
└── docs/                 # Documentação
    ├── README.md         # Documentação principal
    └── STRUCTURE.md      # Este arquivo
```

## 🎯 Benefícios da Nova Estrutura

### ✅ **Organização Clara**
- Separação lógica entre tipos de arquivos
- Facilita a manutenção e navegação no projeto
- Estrutura padrão da indústria

### ✅ **Escalabilidade**
- Facilita a adição de novos recursos
- Permite organização modular
- Suporte para futuras expansões

### ✅ **Manutenibilidade**
- Código mais fácil de encontrar e editar
- Reduz conflitos em equipes
- Facilita debugging e testes

### ✅ **Performance**
- Melhor cache de recursos
- Possibilita otimizações específicas por tipo
- Facilita CDN e compressão

## 🔄 Mudanças Realizadas

1. **Movimentação de Arquivos:**
   - `styles.css` → `assets/css/styles.css`
   - `script.js` → `assets/js/script.js`
   - `sw.js` → `assets/js/sw.js`
   - `manifest.json` → `config/manifest.json`
   - `README.md` → `docs/README.md`

2. **Atualizações de Referências:**
   - Links no `index.html` atualizados
   - Service Worker paths corrigidos
   - Manifest path atualizado

3. **Estrutura de Pastas:**
   - Criadas pastas `assets/`, `config/`, `docs/`
   - Subpastas organizadas por tipo de recurso

## 🚀 Próximos Passos Sugeridos

1. **Adicionar Imagens:**
   - Logo da empresa em `assets/images/`
   - Screenshots para documentação
   - Ícones PWA em `assets/icons/`

2. **Modularização CSS:**
   - Separar componentes em arquivos específicos
   - Criar sistema de variáveis CSS organizado

3. **Modularização JavaScript:**
   - Separar funcionalidades em módulos
   - Implementar bundling para produção

4. **Configurações de Build:**
   - Adicionar scripts de build no `package.json`
   - Configurar minificação e otimização

## 📝 Convenções de Nomenclatura

- **Arquivos:** kebab-case (ex: `user-profile.js`)
- **Pastas:** kebab-case (ex: `assets/images/`)
- **Classes CSS:** BEM methodology quando aplicável
- **IDs/Classes:** camelCase para JavaScript, kebab-case para CSS

---

**Última atualização:** 5 de junho de 2025  
**Versão:** 1.0.0  
**Projeto:** AlertaVia Landing Page
