# 🦷 Lucy — Firestore Structure
## Module: Users
Version: 1.3

---

# 📁 Collection Path

```
users/{uid}
```

O `{uid}` deve ser exatamente igual ao Firebase Authentication UID.

Dentistas, admins e pacientes **compartilham a mesma collection**. A diferença entre eles é o campo `role`.

---

# Document Structure — Dentist / Admin

```ts
export type UserStatus = 'pending' | 'approved' | 'rejected'

export type UserModel = {
  id: string              // Firebase Auth UID
  email: string
  name: string
  role: 'dentist' | 'admin'
  photo?: string | null
  cro?: string | null     // Número do CRO (obrigatório para operar)
  phone?: string | null   // Telefone (obrigatório para operar)
  status?: UserStatus
}
```

# Document Structure — Patient

```ts
export type Gender = 'male' | 'female' | 'other'

export type PatientModel = {
  id: string
  name: string
  nameNormalized: string      // Normalizado para busca (sem acentos, lowercase)
  phone: string
  phoneNormalized: string     // Normalizado para busca
  dob: Date                   // Data de nascimento
  gender: Gender
  role: 'patient'             // Sempre 'patient'
  ownerId: string             // UID do dentista que criou o paciente
  email: string              // Obrigatório — usado para criação da conta no Firebase Auth
  cpf?: string | null
  susNumber?: string | null
  address?: {
    street?: string | null
    number?: string | null
    complement?: string | null
    neighborhood?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
  }
  photo?: string | null
  createdAt?: Date
  updatedAt?: Date
}
```

---

# 📌 Field Definitions

## `id`
- Deve ser exatamente igual ao `request.auth.uid`.
- Nunca gerar UUID separado para dentistas/admins.
- Imutável após criação.

## `email`
- Obrigatório para dentistas e admins.
- Obrigatório para pacientes — necessário para criação da conta no Firebase Auth e para login no app Expo.
- Imutável após criação.

## `role`
Valores permitidos: `'admin'` | `'dentist'` | `'patient'`. Não existem outros roles. Um usuário só pode ter um único role.

- `'admin'` — acesso total. Pode gerenciar medicines, todos os pacientes e prescrições. Pode ser mais de um usuário, mas somente `dramluisabraga@gmail.com` pode promover outros usuários a admin.
- `'dentist'` — acesso operacional. Criado automaticamente no primeiro login. Pode gerenciar apenas seus próprios pacientes e prescrições (`ownerId == uid`).
- `'patient'` — registro de paciente. **Não pode fazer login nesta aplicação web.** Criado pelo dentista via formulário. Pode fazer login no app Expo com email/senha, Google ou Apple.

Regras de negócio:
- Novo usuário que faz login recebe `role: 'dentist'` automaticamente.
- `patient` tentando fazer login é bloqueado com signOut imediato.
- Role não pode ser alterado pelo próprio usuário.
- Qualquer admin pode alterar roles, exceto promover para `'admin'` — isso é exclusivo de `dramluisabraga@gmail.com`.
- Um paciente (`role: 'patient'`) só pode ter um `ownerId`. Tentativa de criação de paciente já cadastrado por outro dentista deve retornar erro.

## `status` (somente dentists/admins)
- `'pending'` → conta criada, aguardando aprovação. Novo dentista começa aqui.
- `'approved'` → conta liberada para operar normalmente.
- `'rejected'` → conta rejeitada. Usuário é deslogado automaticamente ao tentar acessar.
- Controlado apenas pelo admin.

## `cro` e `phone` (somente dentists)
- Obrigatórios para acessar o dashboard.
- Sem esses campos, o proxy redireciona para `/completar-perfil`.
- Nunca salvar string vazia — usar `null`.

## `ownerId` (somente patients)
- UID do dentista que criou o paciente.
- Imutável após criação.
- Nunca pode ser `null`.
- **Um paciente só pode estar associado a um único dentista.** Se um dentista tentar cadastrar um paciente (por CPF, telefone ou qualquer identificador único) que já possui `ownerId` de outro dentista, a operação deve ser bloqueada com erro: `"Este paciente já está cadastrado no sistema por outro dentista."`. Admin não está sujeito a essa restrição.

## `nameNormalized` / `phoneNormalized` (somente patients)
- Versões normalizadas para busca eficiente no Firestore.
- Sempre gerados no repository. Nunca vindos do front diretamente.

---

# 🔐 Access Control

| Ação | Quem pode |
|---|---|
| Ler próprio documento | Próprio usuário autenticado |
| Ler pacientes que criou | Dentista dono (`ownerId == uid`) |
| Ler qualquer documento | Admin |
| Criar próprio documento | Próprio usuário autenticado |
| Criar paciente | Dentista (com `ownerId == uid`) |
| Atualizar qualquer documento | Admin |
| Atualizar próprio documento | Próprio usuário |
| Atualizar paciente | Dentista dono ou admin |
| Deletar documento | Admin ou dono |

---

# ✅ Condição de Acesso Operacional (Dentist)

Para que um dentista opere o sistema, **todas** as condições devem ser verdadeiras:

```
user.role == 'dentist' OR user.role == 'admin'
AND user.status != 'rejected'
AND user.cro != null (para além do /completar-perfil)
AND user.phone != null (para além do /completar-perfil)
```

---

# 🔒 Structural Rules (MANDATORY)

1. Nunca usar `undefined`. Campos opcionais devem existir com `null`.
2. Nunca armazenar `password` no Firestore.
3. Nunca permitir que `patient` faça login na aplicação web.
4. Nunca criar campo `permissions` customizado.
5. Nunca criar paciente com `ownerId` de outro usuário que não seja o dentista logado (exceto admin).
6. Nunca permitir que dentista acesse pacientes de outro dentista.
6.1. Nunca criar paciente que já possui `ownerId` diferente do dentista logado — retornar erro explícito.
7. Nunca restaurar conta com `status: 'rejected'`.
8. Nunca salvar string vazia — usar `null`.
9. `nameNormalized` e `phoneNormalized` são sempre gerados no repository.
10. Todo paciente deve ter email — obrigatório para criação da conta no Firebase Auth.
11. A senha inicial do paciente é gerada no server como a data de nascimento no formato `ddmmyyyy` — nunca salva no Firestore.
12. O `id` do paciente no Firestore deve ser exatamente o UID retornado pelo Firebase Auth no momento da criação.

---

# 🚫 Prohibited for Claude / Any AI

- Criar campo `password`.
- Criar campo `permissions`.
- Criar roles fora do enum `'admin' | 'dentist' | 'patient'`.
- Permitir que `patient` faça login na aplicação web.
- Alterar `role` via lógica de front-end.
- Criar paciente sem `ownerId`.
- Criar paciente sem `email`.
- Criar ou associar paciente que já possui `ownerId` de outro dentista sem retornar erro.
- Salvar a senha do paciente no Firestore.
- Criar paciente no Firestore sem antes criar a conta no Firebase Auth — o UID do Auth deve ser o `id` do documento.
- Salvar string vazia em campos nullable.

Alterações estruturais exigem incremento de versão.
