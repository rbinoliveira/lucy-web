# Lucy — Regras de Negócio Consolidadas
Version: 2.0

## 1) Escopo e arquitetura
- O sistema usa modelo flat no Firestore, sem collection `clinics` e sem `clinicId`.
- Collections raiz:
  - `users/{uid}`
  - `prescriptions/{id}`
  - `medicines/{id}`
- O isolamento entre dentistas é por `ownerId`.

## 2) Regras de autenticação e sessão (web)
- Rotas públicas:
  - `/`
  - `/registrar`
  - `/recuperar-senha`
- Usuário não autenticado tentando rota protegida é redirecionado para `/`.
- Usuário autenticado com perfil incompleto (sem `cro` e/ou `phone` válidos) é redirecionado para `/completar-perfil`.
- Usuário autenticado com perfil completo não pode permanecer em rota pública nem em `/completar-perfil`; é redirecionado para `/dashboard`.
- `role: 'patient'` não deve operar na web; ao detectar patient logado, o app faz signOut e remove cookie.
- `status: 'rejected'` deve causar signOut imediato, limpeza de cookie e mensagem de conta rejeitada.

## 3) Regras de usuários
- Roles válidos: `admin | dentist | patient`.
- Novo usuário que entra por registro/login social é criado com:
  - `role: 'dentist'`
  - `status: 'pending'`
- Condição operacional para dentista usar dashboard:
  - `role` em `dentist|admin`
  - `status !== 'rejected'`
  - `cro` válido (4-7 dígitos)
  - `phone` completo
- Superadmin canônico: `dramluisabraga@gmail.com`.
- Apenas admin pode aprovar/rejeitar contas (`pending -> approved|rejected`).
- Conta rejeitada não deve ser reativada.

## 4) Regras de pacientes
- Paciente deve ser criado em `users` com:
  - `role: 'patient'`
  - `ownerId` do dentista criador
- Email de paciente é obrigatório para provisionamento de conta no Firebase Auth.
- Senha inicial do paciente é derivada do DOB no formato `ddmmyyyy` (gerada no backend; não persiste no Firestore).
- `nameNormalized` e `phoneNormalized` são gerados no backend/repository.
- Regra de negócio esperada: paciente pertence a um único dentista (bloquear vínculo cruzado por outro dentista).

## 5) Regras de medicamentos
- Catálogo global em `medicines` (sem `ownerId`).
- Apenas admin cria/edita/exclui medicamentos.
- Campos mínimos de posologia:
  - `quantity >= 1`
  - `intervalHours >= 1`
  - `durationDays` OU `whilePain=true`
- `nameNormalized` e `defaultDosage` devem ser derivados por regra de domínio (não confiar em payload cru do front).

## 6) Regras de prescrições
- Cada prescrição é um documento independente para 1 medicamento e 1 paciente.
- Campos obrigatórios de vínculo:
  - `patientId`
  - `medicineId`
  - `ownerId`
- `ownerId` deve refletir o dentista dono (ou ser controlado por admin).
- `patientName`, `patientEmail` e `medicineName` são desnormalizados no momento da criação (sem sincronização retroativa obrigatória).
- Dentista não pode acessar prescrições de outro dentista.

## 7) Regras de segurança (Firestore)
- Sem leitura pública; requer autenticação.
- `isAdmin()` nas rules é por email hardcoded (superadmin), não por `role` do documento.
- `medicines`: leitura para autenticado, escrita só admin.
- `users` e `prescriptions`: acesso por dono (`uid`/`ownerId`) ou admin.

## 8) Plano de testes Cypress (cobertura desta entrega)

### 8.1 Objetivo
Validar regras de negócio de acesso, perfil, menu por role e validações críticas de domínio no front.

### 8.2 Especificações adicionadas
- `cypress/e2e/business/access-control.cy.ts`
  - Não autenticado em rota protegida -> redireciona para login.
  - Autenticado com perfil incompleto -> redireciona para `/completar-perfil`.
  - Autenticado com perfil completo -> não acessa rotas públicas.
  - Sidebar exibe `Medicamentos` apenas para `admin`.
- `cypress/e2e/business/complete-profile-rules.cy.ts`
  - CRO inválido bloqueia conclusão.
  - Telefone incompleto bloqueia conclusão.
  - Botão `Completar` só habilita com dados válidos.
- `cypress/e2e/business/medicine-rules.cy.ts`
  - Obriga `durationDays` ou `whilePain`.
  - `whilePain` desabilita campo de duração em dias.
- `cypress/e2e/business/patient-rules.cy.ts`
  - Email de paciente obrigatório no submit.

### 8.3 Itens relevantes ainda não cobertos por E2E nesta entrega
- Fluxos dependentes de integração real com Firebase Auth/Firestore admin (aprovação/rejeição persistida, bloqueio por ownerId cruzado no backend, regras de escrita em collections).
- Fluxo de login social (Google/Apple) e linkagem de provedores.
- Regras de Firestore Security Rules em nível de infraestrutura.

### 8.4 Próxima expansão recomendada
- Suite API/integration para `/api/patient/*`, `/api/prescription/*`, `/api/medicine/*` com fixtures controladas.
- Testes de autorização por ownerId com dois dentistas e um admin em ambiente de teste dedicado.
