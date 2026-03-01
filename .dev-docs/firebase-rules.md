# 🦷 Lucy — Firebase Security Rules
Version: 1.0
Status: LOCKED ✅

---

# 📄 Regras Atuais

```js
rules_version = '2';

// SuperAdmin: identificado por email hardcoded
function isAdmin() {
  return request.auth != null && request.auth.token.email == 'dramluisabraga@gmail.com';
}

function isAuthenticated() {
  return request.auth != null;
}

function isOwner(ownerId) {
  return isAuthenticated() && request.auth.uid == ownerId;
}

service cloud.firestore {
  match /databases/{database}/documents {

    // users: dentistas/admins e pacientes na mesma collection.
    // Leitura/escrita: próprio uid, dono do paciente (ownerId), ou admin.
    match /users/{userId} {
      allow read: if isAuthenticated()
        && (request.auth.uid == userId
          || resource.data.ownerId == request.auth.uid
          || isAdmin());

      allow create: if isAuthenticated()
        && (request.auth.uid == userId
          || request.resource.data.ownerId == request.auth.uid
          || isAdmin());

      allow update, delete: if isAuthenticated()
        && (request.auth.uid == userId
          || resource.data.ownerId == request.auth.uid
          || isAdmin());
    }

    // prescriptions: ownerId = dentista. Só dono ou admin pode ler/escrever.
    match /prescriptions/{prescriptionId} {
      allow read: if isAuthenticated()
        && (resource.data.ownerId == request.auth.uid || isAdmin());

      allow create: if isAuthenticated()
        && (request.resource.data.ownerId == request.auth.uid || isAdmin());

      allow update, delete: if isAuthenticated()
        && (resource.data.ownerId == request.auth.uid || isAdmin());
    }

    // medicines: catálogo compartilhado. Todos podem ler; só admin escreve.
    match /medicines/{medicineId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
  }
}
```

---

# 📌 Helpers Explicados

## `isAdmin()`
- Verifica se o email do token Firebase é exatamente `dramluisabraga@gmail.com`.
- É o único mecanismo de superadmin — não depende do campo `role` no Firestore.
- Garante que mesmo que alguém crie um documento com `role: 'admin'`, não terá permissões extras no Firestore.

## `isAuthenticated()`
- `request.auth != null`.
- Qualquer usuário logado no Firebase Auth.

## `isOwner(ownerId)`
- Verifica se o UID do token é igual ao `ownerId` passado.
- Usado implicitamente nas regras de `users` e `prescriptions`.

---

# 🔐 Resumo de Permissões por Collection

| Collection | Leitura | Escrita |
|---|---|---|
| `users` | Próprio doc, pacientes do dentista, ou admin | Próprio doc, pacientes do dentista, ou admin |
| `prescriptions` | `ownerId == uid` ou admin | `ownerId == uid` ou admin |
| `medicines` | Qualquer autenticado | Apenas admin |

---

# 🔒 Structural Rules (MANDATORY)

1. Nunca remover a verificação `isAdmin()` por email hardcoded.
2. Nunca permitir leitura pública (sem `isAuthenticated()`).
3. Nunca permitir que `patient` escreva prescrições ou medicines.
4. Nunca criar regras baseadas no campo `role` do Firestore — usar email para admin.
5. Nunca permitir `allow delete: if false` em users (delete é necessário para admin).

---

# 🚫 Prohibited for Claude / Any AI

- Remover `isAdmin()` por email.
- Criar regras de acesso baseadas em `resource.data.role`.
- Permitir leitura pública de qualquer collection.
- Criar collection `clinics` ou `pendingAdmins` nas rules.
- Mudar o email do admin diretamente nas rules sem instrução explícita.

Alterações estruturais exigem incremento de versão.
