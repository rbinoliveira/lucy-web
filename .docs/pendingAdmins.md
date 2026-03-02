# 🦷 Lucy — Firestore Structure
## Module: User Status & Approval Flow
Version: 1.0
Status: LOCKED ✅

---

# 📐 Overview

Não existe collection `pendingAdmins`. O fluxo de aprovação de novos dentistas é controlado pelo campo `status` dentro do próprio documento `users/{uid}`.

---

# 🔄 Status Flow

```
'pending' → 'approved'
'pending' → 'rejected'
```

| Status | Significado |
|---|---|
| `'pending'` | Conta criada. Aguardando aprovação do admin. |
| `'approved'` | Conta liberada. Dentista pode operar o dashboard. |
| `'rejected'` | Conta rejeitada. Usuário é deslogado automaticamente. |

---

# 📌 Regras de Negócio

## Criação automática com `'pending'`
- Todo novo usuário que se registra (email/senha ou Google) recebe:
  ```ts
  { role: 'dentist', status: 'pending' }
  ```
- Criado em `users/{uid}` pelo `getOrCreateFirestoreUser()` no auth hook.

## Enquanto `status == 'pending'`
- O proxy redireciona para `/completar-perfil` se o perfil não estiver completo.
- O perfil completo requer: `cro` e `phone` preenchidos.
- Mesmo com perfil completo, o dentista aguarda aprovação do admin.
- Após completar o perfil, o sistema exibe mensagem informando que a equipe entrará em contato pelo telefone cadastrado.

## `status == 'rejected'`
- Detectado no `onAuthStateChanged` do auth hook.
- Resulta em `auth.signOut()` + `deleteAuthCookies()` automático.
- Nunca pode voltar para `'pending'` ou `'approved'`.
- O usuário recebe a mensagem: _"Sua conta foi rejeitada. Entre em contato com o suporte."_

## `status == 'approved'`
- Dentista tem acesso completo ao dashboard.
- Controlado apenas pelo admin.

---

# 🔐 Quem pode alterar `status`

| Ação | Quem pode |
|---|---|
| Definir `status: 'pending'` na criação | Sistema (automático no primeiro login) |
| Alterar `status` para `'approved'` ou `'rejected'` | Apenas admin |
| Alterar o próprio `status` | Nunca permitido |

---

# 🔒 Structural Rules (MANDATORY)

1. Nunca criar collection `pendingAdmins`.
2. `status` vive dentro do documento `users/{uid}`.
3. Nunca permitir que o próprio usuário altere seu `status`.
4. Nunca restaurar `status: 'rejected'` para `'pending'` ou `'approved'`.
5. Status inicial é sempre `'pending'` na criação automática.
6. Usuário com `status: 'rejected'` nunca pode permanecer logado.

---

# 🚫 Prohibited for Claude / Any AI

- Criar collection `pendingAdmins`.
- Criar campo `approved` separado do `status`.
- Permitir que usuário altere o próprio `status`.
- Restaurar conta rejeitada.
- Criar lógica de aprovação fora do campo `status`.

Alterações estruturais exigem incremento de versão.
