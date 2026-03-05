# 🦷 Lucy — Firestore Structure
## Module: Users
Version: 1.5

---

# 📁 Collection Path

```
users/{uid}
```

O `{uid}` deve ser exatamente igual ao Firebase Authentication UID.

Admins, dentistas e pacientes compartilham a mesma collection e a mesma estrutura de dados. A única diferença é o valor de `role`.

---

# Document Structure — Shared (Admin, Dentist, Patient)

```ts
export type UserRole = 'admin' | 'dentist' | 'patient'

export type UserModel = {
  id: string              // Firebase Auth UID
  email: string           // Obrigatório para todos os roles
  name: string
  role: UserRole
  photo?: string | null
  cro?: string | null     // Usado no fluxo operacional web de dentist/admin
  phone?: string | null   // Usado no fluxo operacional web de dentist/admin
  isActive: boolean       // false = aguardando aprovação/inativo; true = conta liberada
  deletedAt?: Date | null // Soft delete permanente quando definido
}
```

---

# 📌 Field Definitions

## `id`
- Deve ser exatamente igual ao `request.auth.uid`.
- Imutável após criação.

## `email`
- Obrigatório para `admin`, `dentist` e `patient`.
- Imutável após criação.

## `role`
Valores permitidos: `'admin' | 'dentist' | 'patient'`.

- `admin`: acesso administrativo.
- `dentist`: acesso operacional.
- `patient`: registro de paciente (não opera no web dashboard).

## `isActive`
- `false`: conta não liberada ou inativa.
- `true`: conta liberada.

## `deletedAt`
- `null`/ausente: conta não deletada.
- `Date`: conta desativada permanentemente (soft delete).

## `cro` e `phone`
- Mantidos no mesmo schema compartilhado.
- Regras de uso na web podem exigir para fluxo operacional de dentist/admin.

---

# ❌ Campos que não devem existir

- `address`
- `susNumber`

---

# 🔐 Access Control

| Ação | Quem pode |
|---|---|
| Ler próprio documento | Próprio usuário autenticado |
| Ler qualquer documento | Admin |
| Criar próprio documento | Próprio usuário autenticado |
| Atualizar próprio documento | Próprio usuário (exceto campos administrativos) |
| Atualizar qualquer documento | Admin |
| Deletar documento | Admin ou dono |

---

# ✅ Condição de Acesso Operacional (Web)

Para operar o dashboard web:

```
(user.role == 'dentist' OR user.role == 'admin')
AND user.isActive == true
AND user.deletedAt == null (ou ausente)
AND user.cro != null
AND user.phone != null
```

---

# 🔒 Structural Rules (MANDATORY)

1. Todos os roles usam o mesmo schema `UserModel`.
2. `email` é obrigatório para todos os roles.
3. Nunca armazenar `password` no Firestore.
4. Nunca criar campo `permissions` customizado.
5. Nunca salvar string vazia — usar `null` em campos opcionais.
6. Nunca usar `status` — usar `isActive` e `deletedAt`.
7. Nunca limpar `deletedAt` após definido.
8. Não criar `address` nem `susNumber` no documento de usuário.

---

# 🚫 Prohibited for Claude / Any AI

- Criar campo `password`.
- Criar campo `permissions`.
- Criar campo `status`.
- Criar roles fora de `'admin' | 'dentist' | 'patient'`.
- Alterar `role`, `isActive` ou `deletedAt` pelo próprio usuário no front.
- Criar `address` ou `susNumber` em `users`.

Alterações estruturais exigem incremento de versão.

---

# 🧪 Definições de Teste E2E (comportamentais)

- O usuário deve visualizar a tela de login na URL `/` com campos de e-mail e senha.
- O usuário deve visualizar erro ao enviar login vazio na URL `/`.
- O usuário deve navegar para `/registrar` ao clicar em “Crie sua conta” na URL `/`.
- O usuário deve navegar para `/recuperar-senha` ao clicar em “Esqueci minha senha” na URL `/`.
- O usuário deve visualizar validações de cadastro na URL `/registrar`.
- O usuário deve ser impedido de operar dashboard se não atender as condições de acesso operacional.
