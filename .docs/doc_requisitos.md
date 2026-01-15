# Objetivo e Contexto

O projeto consiste no desenvolvimento de um sistema web para auxiliar dentistas na prescrição de medicamentos e no monitoramento da adesão ao tratamento dos pacientes. O objetivo é garantir eficácia e acessibilidade, promovendo o letramento em saúde e melhorando a adesão aos tratamentos prescritos.

Além disso, o sistema busca contribuir para a redução do risco de resistência a microorganismos e oferecer suporte aos dentistas no monitoramento das prescrições. A proposta envolve a implementação de soluções que tornem o acompanhamento mais intuitivo e eficiente, permitindo que profissionais da saúde tenham uma experiência mais segura e orientada no uso de medicamentos.

# Público Alvo

- Dentistas das redes públicas e privadas

# User Stories

## Admin
- [ ] 0.1 O Admin deve conseguir cadastrar um medicamento
- [ ] 0.2 O Admin deve conseguir listar medicamentos
- [ ] 0.3 O Admin deve conseguir editar um medicamento
- [ ] 0.4 O Admin deve conseguir remover um medicamento
- [ ] 0.5 O Admin deve conseguir buscar um medicamento pelo nome
- [ ] 0.6 O Admin deve conseguir adicionar vídeos demonstrativos

## Dashboard
- [ ] 1.0 O Dentista deve conseguir visualizar o dashboard com visão geral do sistema

## Autenticação
- [ ] 1.1 O Dentista deve conseguir logar via email/senha
- [ ] 1.2 O Dentista deve conseguir logar via Google
- [ ] 1.3 O Dentista deve conseguir criar uma conta com os dados
- [ ] 1.4 O Dentista deve conseguir recuperar sua senha

## Gestão de Pacientes
- [ ] 2.1 O Dentista deve conseguir cadastrar um paciente
- [ ] 2.2 O Dentista deve conseguir editar um paciente
- [ ] 2.3 O Dentista deve conseguir remover um paciente
- [ ] 2.4 O Dentista deve conseguir listar os pacientes
- [ ] 2.5 O Dentista deve conseguir buscar um paciente pelo nome
- [ ] 2.6 O Dentista deve conseguir visualizar o perfil completo de um paciente
- [ ] 2.7 O Dentista deve conseguir ver o histórico de prescrições de um paciente no perfil
- [ ] 2.8 O Dentista deve conseguir criar prescrição diretamente do perfil do paciente

## Gestão de Prescrições
- [ ] 3.1 O Dentista deve conseguir cadastrar uma prescrição medicamentosa para o paciente
- [ ] 3.2 O Dentista deve conseguir editar uma prescrição medicamentosa de um paciente
- [ ] 3.3 O Dentista deve conseguir remover uma prescrição medicamentosa de um paciente
- [ ] 3.4 O Dentista deve conseguir listar as prescrições de um determinado paciente
- [ ] 3.5 O Dentista deve conseguir listar todas as prescrições do sistema (listagem geral)
- [ ] 3.6 O Dentista deve conseguir buscar prescrições na listagem geral
- [ ] 3.7 O Dentista deve conseguir filtrar prescrições por status na listagem geral
- [ ] 3.8 O Dentista deve conseguir criar prescrição tanto pela listagem geral quanto pelo perfil do paciente

## Monitoramento
- [ ] 4.1 O Dentista deve conseguir acompanhar a interação do paciente com os medicamentos
- [ ] 5.1 O Dentista deve conseguir gerar um relatório sobre o sucesso do tratamento (feature em brainstorm)

## Comunicação
- [ ] 6.1 O Dentista deve conseguir enviar texto para o paciente
- [ ] 7.1 O Dentista deve conseguir enviar áudio para o paciente

# Requisitos Não Funcionais

- [ ] Sistema acessível via navegador, responsivo
- [ ] Na funcionalidade de criação de conta, o usuário irá se registrar com o status pendente, sendo necessário a aprovação para ele poder logar na aplicação (a validar se será possível qualquer um se cadastrar sem aprovação ou não)
- [ ] Na criação de uma prescrição medicamentosa, ter um campo de combobox que ao digitar algumas letras aparece medicamentos que começam com aquela letra e ao selecionar preencher automaticamente os campos restantes mas permitindo edição

# Funcionalidades Detalhadas

## Dashboard

O dashboard deve exibir uma visão geral do sistema com informações relevantes para o dentista:

### Cards de Métricas Principais
- **Tratamentos Ativos**: Total de pacientes em tratamento ativo
- **Adesão Média**: Percentual médio de adesão às medicações pelos pacientes
- **Alertas Pendentes**: Quantidade de alertas que requerem atenção do dentista

### Seção de Notificações de Alerta
- Lista de alertas recentes que requerem atenção:
  - Pacientes que não confirmaram dose há X dias
  - Pacientes que atrasaram doses
  - Pacientes que perderam doses
- Cada alerta deve mostrar: nome do paciente, medicamento, situação e ações rápidas (contato telefônico, chat)

### Últimas Prescrições
- Lista das prescrições mais recentes criadas
- Mostrar: paciente, medicamento, horário de criação, status de sincronização
- Link para ver todas as prescrições

### Ações Rápidas
- Botões de acesso rápido:
  - Nova Prescrição
  - Novo Paciente
- Status do Sistema: indicador de sincronização automática com apps dos pacientes

### Dados Sugeridos para o Dashboard
- Total de pacientes cadastrados
- Total de prescrições ativas
- Taxa de adesão geral aos tratamentos
- Alertas e notificações pendentes
- Últimas atividades do sistema
- Gráficos de evolução (opcional para versões futuras)

## ADM - Gestão de Medicamentos

### Listagem de Medicamentos
- Tabela com todos os medicamentos cadastrados
- Colunas: Princípio Ativo, Dose, Forma Farmacêutica, Via de Administração, Ações
- Busca por nome do medicamento
- Paginação (ex: mostrar 25 itens por página)
- Botão para adicionar novo medicamento

### CRUD Completo de Medicamentos
- **Criar**: Formulário para cadastrar novo medicamento
- **Ler**: Visualizar lista e detalhes do medicamento
- **Atualizar**: Editar informações do medicamento existente
- **Deletar**: Remover medicamento do sistema (com confirmação)

### Campos para Cadastro/Edição de Medicamentos
- **Princípio ativo** – campo aberto – ex: dipirona 50mg/ml
- **Dose** – campo aberto – ex: 50mg/ml
- **Forma farmacêutica** – selecionar:
  - Solução oral → tomar
  - Suspensão oral → tomar
  - Comprimido → tomar
  - Cápsula → tomar
  - Pílula → tomar
  - Pastilha → chupar
  - Drágea → tomar
  - Xarope → tomar
  - Gotas → tomar
  - Pomada → aplicar
  - Creme → aplicar
  - Pasta → aplicar
  - Spray / aerossol → aplicar
- **Via de administração** - selecionar:
  - Oral
  - Sublingual
  - Tópica
- **Quantidade a ser tomada** - campo numérico - ex: 1
- **Tempo de administração** - campo numérico - ex: 8 (horas)
- **Quantidade de dias** - campo numérico - ex: 7
- **Enquanto dor** - campo boolean - ou vai ser preenchido esse ou quantidade de dias
- **Posologia Padrão** - campo de texto (textarea) - Posologia padrão recomendada para o medicamento (opcional, pode ser preenchida automaticamente)

## DENTISTA - Gestão de Pacientes

### Listagem de Pacientes
- Tabela com todos os pacientes cadastrados
- Ordenação: por nome (ascendente)
- Colunas: Nome, Data de Nascimento (com idade), Telefone, Ações
- Busca por nome do paciente
- Paginação (ex: mostrar 25 itens por página)
- Botões de ação na listagem: visualizar perfil, editar, deletar, adicionar prescrição

### Perfil do Paciente
Tela detalhada com informações completas do paciente e histórico:

#### Informações do Paciente
- Nome completo
- Data de nascimento (com idade calculada)
- Telefone
- E-mail (se cadastrado)
- CPF (se cadastrado)
- Endereço completo (se cadastrado)
- Número do SUS (se cadastrado)
- Botão para editar informações do paciente

#### Cards de Resumo
- **Total de Prescrições**: Quantidade total de prescrições já criadas para o paciente
- **Prescrições Ativas**: Quantidade de prescrições em andamento
- **Prescrições Finalizadas**: Quantidade de prescrições concluídas
- **Taxa de Adesão**: Percentual de adesão do paciente aos tratamentos

#### Histórico de Prescrições
- Tabela com todas as prescrições do paciente
- Colunas: Medicamento, Dose, Posologia, Data de Criação, Status, Ações
- Status possíveis: Ativa, Finalizada, Cancelada
- Botões de ação: visualizar detalhes, editar, deletar
- Paginação do histórico
- Botão para criar nova prescrição diretamente do perfil

### CRUD Completo de Pacientes
- **Criar**: Formulário para cadastrar novo paciente (nome, telefone, data de nascimento)
- **Ler**: Visualizar lista e perfil completo do paciente
- **Atualizar**: Editar informações do paciente existente
- **Deletar**: Remover paciente do sistema (com confirmação)

## DENTISTA - Gestão de Prescrições

### Listagem Geral de Prescrições
- Tabela com todas as prescrições do sistema
- Ordenação: por data de criação (descendente - mais recentes primeiro)
- Colunas: Paciente (com idade), Medicamento, Dose, Posologia, Data de Criação, Status, Ações
- Busca por nome do paciente ou medicamento
- Filtro por status: Todas, Ativas, Finalizadas, Canceladas
- Paginação (ex: mostrar 25 itens por página)
- Botões de ação: visualizar detalhes, editar, deletar
- Botão para criar nova prescrição

### Adicionar Nova Prescrição
A mesma tela é usada para criar prescrição tanto pela listagem geral quanto pelo perfil do paciente:

**Quando acessado pela listagem geral de prescrições:**
- Campo "Paciente" deve ser um autocomplete combobox para selecionar o paciente
- Usuário digita o nome e seleciona da lista

**Quando acessado pelo perfil do paciente:**
- Campo "Paciente" já vem preenchido com o nome do paciente
- Campo desabilitado (não pode alterar o paciente)
- Link para voltar ao perfil do paciente

### Campos da Prescrição
- **Paciente** – Campo autocomplete combobox (quando criado pela listagem geral) ou campo desabilitado preenchido (quando criado pelo perfil)
- **Princípio ativo** – Campo autocomplete combo box que tem como itens os medicamentos do banco
- **Posologia** – Campo de texto (textarea) que é preenchido automaticamente após selecionar o medicamento
  - Campo desabilitado inicialmente para obrigar seleção do medicamento primeiro
  - Após selecionar medicamento, campo é habilitado e pode ser editado
  - Texto explicativo: "Este campo foi preenchido automaticamente após selecionar o medicamento, mas pode ser editado conforme necessário"

### Geração de Texto de Posologia

Ao selecionar um medicamento na prescrição, o sistema deve gerar automaticamente o texto de posologia seguindo o padrão:
```
{verbo de acordo com a forma farmacêutica} {quantidade a ser tomada} {forma farmacêutica} via {via de administração} a cada {tempo de administração} horas por {quantidade de dias} dias
```

Exemplo: "tomar 1 cápsula via oral a cada 8 horas por 7 dias"

O texto de posologia deve aparecer para o dentista e ser salvo no banco. O dentista pode editar este texto antes de salvar a prescrição.

### Informações de Sincronização
- Banner informativo: "Sincronização Automática"
- Texto: "Esta prescrição será sincronizada automaticamente com o app do paciente após salvar"
- Indicador visual de status de sincronização nas listagens

### CRUD Completo de Prescrições
- **Criar**: Formulário para cadastrar nova prescrição (acessível pela listagem geral ou perfil do paciente)
- **Ler**: Visualizar lista geral, lista por paciente e detalhes da prescrição
- **Atualizar**: Editar informações da prescrição existente
- **Deletar**: Remover prescrição do sistema (com confirmação)

# Modelo de Dados

## Estrutura do Banco de Dados

### Pacientes (`patients`)
- `id` (UUID) - Identificador único do paciente - PRIMARY KEY
- `nome` (STRING) - Nome completo - NOT NULL
- `email` (STRING) - E-mail do paciente - UNIQUE, NULLABLE
- `telefone` (STRING) - Telefone de contato - NOT NULL
- `genero` (STRING) - Gênero - NOT NULL
- `data_nascimento` (DATE) - Data de nascimento - NOT NULL
- `endereco_completo` (STRING) - Endereço completo - NULLABLE
- `numero_do_sus` (STRING) - Número do SUS - NULLABLE
- `created_at` (TIMESTAMP) - Data de criação do registro - DEFAULT NOW()
- `updated_at` (TIMESTAMP) - Última atualização do registro - DEFAULT NOW()

### Dentistas (`dentists`)
- `id` (UUID) - Identificador único do dentista - PRIMARY KEY
- `nome` (STRING) - Nome completo - NOT NULL
- `cro` (STRING) - Número do CRO - UNIQUE, NOT NULL
- `email` (STRING) - E-mail profissional - UNIQUE, NOT NULL
- `telefone` (STRING) - Telefone de contato - NOT NULL
- `senha` (STRING HASH) - Senha criptografada - NOT NULL
- `created_at` (TIMESTAMP) - Data de criação do registro - DEFAULT NOW()
- `updated_at` (TIMESTAMP) - Última atualização do registro - DEFAULT NOW()

### Medicamentos (`medicines`)
- `id` (UUID) - Identificador único do medicamento - PRIMARY KEY
- `principio_ativo` (STRING) - Nome do princípio ativo - NOT NULL
- `dose` (STRING) - Dose do medicamento (ex: 500mg) - NOT NULL
- `forma_farmaceutica` (STRING) - Forma farmacêutica - NOT NULL
- `via_administracao` (STRING) - Via de administração - NOT NULL
- `posologia_padrao` (TEXT) - Posologia padrão recomendada - NULLABLE
- `created_at` (TIMESTAMP) - Data de criação do registro - DEFAULT NOW()
- `updated_at` (TIMESTAMP) - Última atualização do registro - DEFAULT NOW()

### Prescrições Médicas (`prescriptions`)
- `id` (UUID) - Identificador único da prescrição - PRIMARY KEY
- `patient_id` (UUID) - ID do paciente - FOREIGN KEY, NOT NULL
- `dentist_id` (UUID) - ID do dentista - FOREIGN KEY, NOT NULL
- `medicine_id` (UUID) - ID do medicamento - FOREIGN KEY, NOT NULL
- `principio_ativo` (STRING) - Nome do princípio ativo - NOT NULL
- `posologia` (TEXT) - Posologia da prescrição - NOT NULL
- `status` (STRING) - Status da prescrição (ativa, finalizada, cancelada) - NOT NULL, DEFAULT 'ativa'
- `observacoes` (TEXT) - Observações adicionais - NULLABLE
- `sincronizado` (BOOLEAN) - Indica se foi sincronizado com app do paciente - DEFAULT false
- `created_at` (TIMESTAMP) - Data de criação do registro - DEFAULT NOW()
- `updated_at` (TIMESTAMP) - Última atualização do registro - DEFAULT NOW()

## Relacionamentos
- `dentists` (1) ↔ (N) `prescriptions` - Um dentista pode ter várias prescrições
- `patients` (1) ↔ (N) `prescriptions` - Um paciente pode ter várias prescrições
- `medicines` (1) ↔ (N) `prescriptions` - Um medicamento pode estar em várias prescrições

# Plano de Testes

## Casos de Teste por Funcionalidade

### 1. Cadastro do dentista por e-mail/senha
- **ID**: WEB-001
- **Funcionalidade**: Cadastro por e-mail/senha
- **Objetivo**: Verificar que um novo dentista consegue se cadastrar com e-mail e senha válidos.
- **Passos**:
  1. Acessar a página de cadastro.
  2. Preencher os campos obrigatórios com dados válidos.
  3. Submeter o formulário.
- **Dados de Teste**:
  - E-mail válido
  - Senha válida (pelo menos 6 caracteres)
  - Campos adicionais obrigatórios (nome)
- **Resultados Esperados**:
  - Conta criada com sucesso.
  - Redirecionamento adequado (dashboard) e mensagem de sucesso.
- **Fluxos e Edge Cases**:
  - E-mail inválido: exibir erro de validação.
  - Senha fora da política: exibir erro de validação.
  - E-mail já existente: bloquear cadastro com mensagem adequada.

### 2. Cadastro do dentista por Google
- **ID**: WEB-002
- **Funcionalidade**: Cadastro via Google
- **Objetivo**: Verificar que um novo dentista consegue se cadastrar usando conta Google.
- **Passos**:
  1. Acessar a tela de cadastro e escolher "Cadastrar com Google".
  2. Selecionar a conta Google de teste e conceder permissões.
  3. Concluir o fluxo de autenticação.
- **Dados de Teste**:
  - Conta Google de teste
- **Resultados Esperados**:
  - Usuário criado e autenticado.
  - Redirecionamento para dashboard.
- **Fluxos e Edge Cases**:
  - Cancelamento do pop-up: manter usuário deslogado.
  - Conta Google já vinculada: tratar como login (não duplicar contas).

### 3. Login do dentista por e-mail/senha
- **ID**: WEB-003
- **Funcionalidade**: Login por e-mail/senha
- **Objetivo**: Garantir que usuários existentes conseguem autenticar com credenciais válidas.
- **Passos**:
  1. Acessar a tela de login.
  2. Informar e-mail e senha válidos.
  3. Clicar em "Entrar".
- **Dados de Teste**:
  - E-mail existente
  - Senha correta
- **Resultados Esperados**:
  - Autenticação bem-sucedida.
  - Redirecionamento para dashboard.
- **Fluxos e Edge Cases**:
  - Senha incorreta: exibir erro.
  - Conta inexistente: exibir erro.
  - Conta existente mas associado a paciente: exibir erro.

### 4. Login do dentista por Google
- **ID**: WEB-004
- **Funcionalidade**: Login via Google
- **Objetivo**: Verificar que usuários com conta Google conseguem autenticar.
- **Passos**:
  1. Acessar a tela de login e escolher "Continuar com Google".
  2. Selecionar a conta Google e concluir o fluxo.
- **Dados de Teste**:
  - Conta Google vinculada ao sistema.
- **Resultados Esperados**:
  - Autenticação e redirecionamento para dashboard.
- **Fluxos e Edge Cases**:
  - Cancelar o pop-up: não autentica.
  - Conta Google não vinculada: criar e logar usuário.
  - Conta existente mas associado a paciente: exibir erro.

### 5. Recuperação de senha do dentista
- **ID**: WEB-005
- **Funcionalidade**: Recuperação de senha
- **Objetivo**: Validar o fluxo de reset de senha por e-mail.
- **Passos**:
  1. Acessar a tela "Esqueci minha senha".
  2. Informar o e-mail cadastrado e solicitar reset.
  3. Verificar recebimento do e-mail e seguir instruções.
  4. Definir nova senha e confirmar login com a nova senha.
- **Dados de Teste**:
  - E-mail do usuário de teste.
- **Resultados Esperados**:
  - E-mail de reset enviado.
  - Link válido e atualização de senha bem-sucedida.

### 6. Logout do dentista
- **ID**: WEB-006
- **Funcionalidade**: Logout
- **Objetivo**: Garantir que o usuário consiga sair da sessão com segurança.
- **Passos**:
  1. Estando logado, acionar a opção de logout.
  2. Validar limpeza de sessão/local storage/cookies conforme implementação.
  3. Navegar para página protegida e confirmar redirecionamento para login.
- **Dados de Teste**: N/A
- **Resultados Esperados**:
  - Sessão encerrada.
  - Acesso a rotas protegidas bloqueado até novo login.
- **Fluxos e Edge Cases**:
  - Intermitência de rede: não deve deixar sessão em estado inconsistente.

## Checklist Geral de Validação
- [ ] Mensagens de erro e sucesso estão claras e localizadas corretamente.
- [ ] Validações de formulário (required, formatos, limites) funcionam.
- [ ] Acessibilidade básica (focus, labels, aria) respeitada nas telas de auth.
- [ ] Logs de erro não expõem informações sensíveis no console.
- [ ] Fluxos de autenticação funcionam em janela anônima e com cookies limpos.
- [ ] Comportamento consistente em diferentes navegadores suportados.

# Versões

# Prazos

