# 🦷 Lucy — Firestore Structure
## Module: Architecture Overview
Version: 1.0
Status: LOCKED ✅

---

# 📐 System Overview

Lucy é um sistema de gestão odontológica SaaS com modelo **flat** (sem multi-tenancy por clínica no Firestore). Todas as entidades ficam em collections raiz, separadas por `ownerId`.

**Não existe collection `clinics`.**

---

# 📁 Collections Raiz

```
users/{uid}           → dentistas, admins e pacientes
prescriptions/{id}    → prescrições médicas
medicines/{id}        → catálogo de medicamentos (gerenciado pelo admin)
```

---

# 👤 Modelo de Isolamento de Dados

O isolamento entre dentistas é feito pelo campo `ownerId`:

```
users/{patientId}          → ownerId = uid do dentista
prescriptions/{id}         → ownerId = uid do dentista
```

- Dentista só acessa dados onde `ownerId == request.auth.uid`.
- Admin (`dramluisabraga@gmail.com`) acessa tudo.
- Não há clínica como entidade — o dentista é a unidade de isolamento.

---

# 🔑 Roles e Acesso

| Role | Login | Acesso |
|---|---|---|
| `admin` | ✅ Email/senha ou Google | Tudo (medicines write, todos os users/prescriptions) |
| `dentist` | ✅ Email/senha ou Google | Próprios pacientes e prescrições |
| `patient` | ❌ Bloqueado | N/A — apenas registro |

---

# 🔐 SuperAdmin (Admin)

O admin é identificado pelo email hardcoded nas Firestore Rules:

```
dramluisabraga@gmail.com
```

No Firestore, o documento do admin em `users/{uid}` tem `role: 'admin'`.

O código da aplicação verifica `role === 'admin'` para liberar funcionalidades como:
- Acesso à rota `/medicamentos`
- Bypass do filtro por `ownerId` em patients e prescriptions

---

# 🔄 Fluxo de Onboarding (Dentist)

```
1. Dentista acessa /registrar ou faz login com Google
2. Conta criada no Firebase Auth
3. Documento criado em users/{uid} com:
   - role: 'dentist'
   - status: 'pending'
4. Proxy redireciona para /completar-perfil (sem cro/phone)
5. Dentista preenche nome, CRO e telefone
6. Admin aprova (status: 'approved')
7. Dentista acessa /dashboard
```

---

# 🔒 Structural Rules (MANDATORY)

1. Nunca criar collection `clinics`.
2. Nunca criar entidade de multi-tenancy.
3. O isolamento é sempre via `ownerId`.
4. Nunca criar clínica automaticamente após login.
5. Admin é sempre identificado por email nas Firestore Rules, não por um campo de permissão customizado.

---

# 🚫 Prohibited for Claude / Any AI

- Criar collection `clinics`.
- Criar subcollections de clínicas.
- Criar campo `clinicId`.
- Criar sistema de multi-tenancy por clínica.
- Mudar a estratégia de isolamento por `ownerId`.

Alterações estruturais exigem incremento de versão.

---

# 🌐 Regras de Acesso Web (distribuído de business-rules)

## Rotas públicas
- `/`
- `/registrar`
- `/recuperar-senha`

## Guardas de rota
- Usuário não autenticado acessando rota protegida deve ser redirecionado para `/`.
- Usuário autenticado com perfil incompleto deve ser redirecionado para `/completar-perfil`.
- Usuário autenticado com perfil completo não deve permanecer em rota pública nem em `/completar-perfil`; deve ser redirecionado para `/dashboard`.
- Cookie de autenticação inválido/malformado deve ser tratado como sessão não autenticada.

## Definições de Teste E2E (comportamentais)
- O usuário não autenticado deve ser redirecionado para `/` ao tentar acessar `/dashboard`.
- O usuário com perfil incompleto deve ser redirecionado para `/completar-perfil` ao tentar acessar `/dashboard`.
- O usuário com perfil completo deve ser redirecionado para `/dashboard` ao acessar `/`, `/registrar` e `/recuperar-senha`.
- O usuário com cookie malformado deve ser redirecionado para `/` ao tentar acessar `/dashboard`.
