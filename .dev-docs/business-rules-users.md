# Lucy — Regras de Negócio: Usuários
Version: 1.0

---

## Criação de conta (dentista)

Um usuário pode criar uma conta nova pelo formulário de registro ou fazendo login com Google. Ao criar a conta, o sistema automaticamente atribui `role: 'dentist'` e `status: 'pending'`. O usuário não escolhe seu papel — isso é definido pelo sistema.

Após criar a conta, o dentista é redirecionado para `/completar-perfil`, onde deve preencher nome, CRO e telefone. Enquanto esses campos não estiverem preenchidos, o sistema bloqueia o acesso ao dashboard e mantém o dentista nessa tela.

Mesmo com o perfil completo, o dentista ainda não pode acessar o sistema — ele precisa aguardar a aprovação do admin. Nesse estado (`status: 'pending'` com perfil completo), o sistema exibe a mensagem informando que a equipe entrará em contato pelo telefone cadastrado.

---

## Aprovação de conta

Somente o admin pode aprovar ou rejeitar um dentista. O único admin do sistema é o usuário com email `dramluisabraga@gmail.com` — não existe outro admin. O admin altera o campo `status` de `'pending'` para `'approved'` ou `'rejected'`. O próprio dentista nunca pode alterar seu status.

Quando aprovado (`status: 'approved'`), o dentista passa a ter acesso completo ao dashboard.

Quando rejeitado (`status: 'rejected'`), o sistema detecta isso automaticamente no fluxo de autenticação, faz logout imediato e exibe a mensagem: _"Sua conta foi rejeitada. Entre em contato com o suporte."_ Uma conta rejeitada nunca pode ser reativada — não é possível voltar para `'pending'` ou `'approved'`.

---

## Pacientes

Um dentista pode cadastrar pacientes via formulário. O paciente recebe `role: 'patient'` e fica vinculado ao dentista pelo campo `ownerId` (que recebe o UID do dentista que o cadastrou).

**Email é obrigatório para pacientes** — é necessário para criar a conta no Firebase Auth e para o paciente acessar o app Expo.

Ao cadastrar um paciente, o server (via `firebase-admin`):
1. Cria o usuário no Firebase Authentication com o email fornecido e senha inicial igual à data de nascimento no formato `ddmmyyyy` (ex: nascido em 31/01/1957 → senha `31011957`)
2. Usa o UID retornado pelo Firebase Auth como o `id` do documento no Firestore
3. O dentista informa verbalmente ao paciente que a senha inicial é sua data de nascimento

**Um paciente só pode pertencer a um único dentista.** Se um dentista tentar cadastrar um paciente que já está associado a outro dentista, a operação é bloqueada e ele recebe o erro: _"Este paciente já está cadastrado no sistema por outro dentista."_

O admin não está sujeito a essa restrição e pode gerenciar qualquer paciente.

Pacientes **não fazem login na aplicação web**. Se um usuário com `role: 'patient'` tentar se autenticar na web, o sistema executa logout imediato.

---

## Autenticação do paciente no app Expo

No app Expo, o paciente pode se autenticar de três formas:

1. **Email + senha** — email cadastrado pelo dentista, senha inicial é a data de nascimento (`ddmmyyyy`). O app deve sugerir a troca de senha no primeiro acesso.
2. **Google** — login com a conta Google associada ao mesmo email cadastrado.
3. **Apple** — login com Apple ID (obrigatório para apps distribuídos na App Store).

Para que Google e Apple funcionem corretamente com a conta já existente, o Firebase deve ter a opção **"link accounts that use the same email"** ativada — isso garante que o paciente que loga com Google usando o mesmo email do cadastro não crie uma conta duplicada.

---

## Isolamento de dados entre dentistas

Cada dentista só enxerga os dados que ele mesmo criou. Um dentista não consegue ver, editar ou acessar pacientes ou prescrições de outro dentista. O isolamento é garantido pelo campo `ownerId` em todas as entidades.

---

## Admin

O admin principal é `dramluisabraga@gmail.com`. Podem existir outros usuários com `role: 'admin'`, mas somente `dramluisabraga@gmail.com` pode promover outros usuários a admin — nenhum outro admin tem essa permissão.

Um usuário só pode ter um único role, e os únicos valores válidos são `'admin'`, `'dentist'` ou `'patient'`. Não existem roles combinados ou customizados.

O admin pode:
- Aprovar ou rejeitar dentistas
- Acessar qualquer paciente ou prescrição, independente do `ownerId`
- Gerenciar o catálogo de medicamentos (criar, editar, deletar)
- Alterar o `role` de qualquer usuário (somente `dramluisabraga@gmail.com` pode promover para `'admin'`)

As funcionalidades exclusivas do admin (aprovar dentistas e gerenciar medicamentos) são acessadas por um **projeto web separado**, dedicado à administração. Esse projeto utiliza o mesmo Firebase/Firestore, mas é uma aplicação independente do sistema usado pelos dentistas.

---

## Condição para operar (dentist)

Para que um dentista possa acessar o dashboard e operar o sistema, todas as condições abaixo devem ser verdadeiras simultaneamente:

- `role` é `'dentist'` ou `'admin'`
- `status` não é `'rejected'`
- `cro` está preenchido (não nulo)
- `phone` está preenchido (não nulo)

---

## Campos imutáveis

Os seguintes campos não podem ser alterados após a criação:

- `id` — sempre igual ao Firebase Auth UID (para pacientes: UID gerado no momento do `createUser` pelo firebase-admin)
- `email` — definido no cadastro
- `ownerId` (pacientes) — dentista que criou o paciente, nunca pode mudar
- `role` — não pode ser alterado pelo próprio usuário; somente admin pode alterar
