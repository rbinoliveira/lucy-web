# Lucy — Regras de Negócio Consolidadas
Version: 2.1

## 1) Escopo e arquitetura
- O sistema usa modelo flat no Firestore, sem collection `clinics` e sem `clinicId`.
- Collections raiz:
  - `users/{uid}`
  - `prescriptions/{id}`
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

## 5) Regras de prescrições
- Cada prescrição é um documento independente para 1 paciente.
- Campos obrigatórios de vínculo:
  - `patientId`
  - `medicineName` (texto livre; catálogo de medicamentos fica em outro projeto)
  - `ownerId`
- `medicineId` é opcional (vazio quando o medicamento é informado apenas por nome).
- `ownerId` deve refletir o dentista dono (ou ser controlado por admin).
- `patientName`, `patientEmail` e `medicineName` são desnormalizados no momento da criação (sem sincronização retroativa obrigatória).
- Dentista não pode acessar prescrições de outro dentista.

## 6) Regras de segurança (Firestore)
- Sem leitura pública; requer autenticação.
- `isAdmin()` nas rules é por email hardcoded (superadmin), não por `role` do documento.
- `users` e `prescriptions`: acesso por dono (`uid`/`ownerId`) ou admin.

## 7) Plano de testes Cypress (matriz plano -> E2E)

### 7.1 Objetivo
Garantir que cada plano de teste funcional tenha cobertura E2E, exceto itens inviáveis por dependência externa (providers OAuth e enforcement de rules no backend gerenciado).

### 7.2 Planos e cobertura implementada

| ID | Plano de teste | Cobertura E2E |
|---|---|---|
| P01 | Login: renderização, validações e erro de credencial | `cypress/e2e/auth/login.cy.ts` |
| P02 | Registro: validações, mismatch de senha e feedback de sucesso | `cypress/e2e/auth/register.cy.ts` |
| P03 | Recuperação de senha: validações e feedback de envio | `cypress/e2e/auth/recover-password.cy.ts` |
| P04 | Guardas de rota: público/protegido, cookie inválido, redirects de sessão | `cypress/e2e/business/access-control.cy.ts` |
| P05 | Perfil incompleto: obrigatoriedade de CRO e telefone para operar | `cypress/e2e/business/complete-profile-rules.cy.ts` |
| P06 | Pacientes: e-mail obrigatório no fluxo de cadastro | `cypress/e2e/business/patient-rules.cy.ts` |
| P07 | Prescrições: campos obrigatórios de vínculo e posologia | `cypress/e2e/business/prescription-rules.cy.ts` |
| P08 | Prescrição: prefill por query param `patientName` | `cypress/e2e/business/prescription-rules.cy.ts` |

### 7.3 Planos não viáveis em E2E puro (nesta stack)

| ID | Plano de teste | Motivo técnico |
|---|---|---|
| X01 | Login social Google/Apple e linkagem de providers por e-mail | Fluxo depende de janela OAuth/provedor externo e credenciais reais |
| X02 | Firestore Security Rules (isAdmin por email hardcoded, ownerId enforcement no backend gerenciado) | Rules são avaliadas no backend Firebase; E2E browser não valida rule engine isoladamente |
| X03 | Aprovação/rejeição persistida por admin em projeto web separado | Fluxo depende de outro projeto/admin panel e estado compartilhado externo |

### 7.4 Expansão recomendada para fechar X01-X03
- Criar suíte de integração com Firebase Emulator Suite para validar rules e autorização por `ownerId`.
- Criar suíte de contrato para APIs `/api/prescription/*`, `/api/patient/*` com fixtures controladas.
- Criar smoke tests dedicados para admin web separado (aprovação/rejeição de dentistas; catálogo de medicamentos em outro projeto).
