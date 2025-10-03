# journey-automation

journey-automation/
├── backend/
│   ├── src/
│   │   ├── application/        # Casos de uso (orquestração da lógica de negócio)
│   │   │   ├── use-cases/      # Implementação dos casos de uso (ex.: associar jornada a colaborador)
│   │   │   └── services/       # Serviços auxiliares usados pelos casos de uso
│   │   ├── domain/             # Camada de domínio (regras de negócio)
│   │   │   ├── entities/       # Modelos de domínio (ex.: Jornada, Colaborador)
│   │   │   └── value-objects/  # Objetos de valor (ex.: Email, Data)
│   │   ├── infrastructure/     # Adapters e frameworks externos
│   │   │   ├── database/       # Conexão e repositórios (ex.: MongoDB)
│   │   │   ├── jobs/           # Configuração do BullJS para jobs em background
│   │   │   ├── http/           # Controllers e rotas da API REST
│   │   │   └── validation/     # Schemas Joi para validação
│   │   ├── shared/             # Código compartilhado (ex.: helpers, middlewares)
│   │   └── index.js            # Ponto de entrada da aplicação
│   ├── tests/                  # Testes unitários e de integração
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── setup.js            # Configuração dos testes (ex.: Jest)
│   └── package.json            # Dependências do backend
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes React reutilizáveis
│   │   ├── pages/              # Páginas principais (ex.: Home, Jornada)
│   │   ├── services/           # Comunicação com a API (ex.: Axios)
│   │   ├── hooks/              # Custom hooks (ex.: useFetch)
│   │   ├── App.jsx             # Componente raiz
│   │   └── index.jsx           # Ponto de entrada do frontend
│   ├── public/                 # Arquivos estáticos (ex.: index.html)
│   └── package.json            # Dependências do frontend
├── README.md                   # Documentação do projeto
└── .env                        # Variáveis de ambiente