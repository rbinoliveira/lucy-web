# Lucy — Firestore Structure
## Module: Medicines
Version: 1.0

---

# Visão Geral

`medicines` é o catálogo global de medicamentos gerenciado exclusivamente pelo admin. Dentistas consultam o catálogo para criar prescrições, mas não podem criar, editar ou deletar medicamentos.

---

# Collection Path

```
medicines/{medicineId}
```

---

# Document Structure

```ts
export type PharmaceuticalForm =
  | 'solucao_oral'
  | 'suspensao_oral'
  | 'comprimido'
  | 'capsula'
  | 'pilula'
  | 'pastilha'
  | 'dragea'
  | 'xarope'
  | 'gotas'
  | 'pomada'
  | 'creme'
  | 'pasta'
  | 'spray'

export type AdministrationRoute = 'oral' | 'sublingual' | 'topica'

export type MedicineModel = {
  id: string
  name: string                    // Princípio ativo (ex: "Amoxicilina")
  nameNormalized: string          // Normalizado para busca (sem acentos, lowercase)
  dose: string                    // Concentração (ex: "500mg", "250mg/5ml")
  pharmaceuticalForm: PharmaceuticalForm
  administrationRoute: AdministrationRoute
  quantity: number                // Quantidade por dose (mínimo: 1)
  intervalHours: number           // Intervalo entre doses em horas (mínimo: 1)
  durationDays?: number           // Duração em dias — obrigatório se whilePain não for true
  whilePain?: boolean             // Se true, duração é "enquanto houver dor"
  defaultDosage: string           // Posologia gerada automaticamente pela função generateDosage()
  createdAt?: Date
  updatedAt?: Date
}
```

---

# Field Definitions

## `id`
- UUID gerado no repository.
- Imutável após criação.

## `name`
- Princípio ativo do medicamento (não nome comercial).
- Obrigatório.

## `nameNormalized`
- Versão de `name` sem acentos e em lowercase.
- Sempre gerado no repository. Nunca vindo do front.
- Usado para busca eficiente no Firestore.

## `dose`
- Concentração do medicamento. Ex: `"500mg"`, `"250mg/5ml"`, `"1g"`.
- Obrigatório.

## `pharmaceuticalForm`
- Forma farmacêutica do medicamento.
- Valores permitidos:

| Valor | Label | Verbo de posologia |
|---|---|---|
| `solucao_oral` | Solução oral | tomar |
| `suspensao_oral` | Suspensão oral | tomar |
| `comprimido` | Comprimido | tomar |
| `capsula` | Cápsula | tomar |
| `pilula` | Pílula | tomar |
| `pastilha` | Pastilha | chupar |
| `dragea` | Drágea | tomar |
| `xarope` | Xarope | tomar |
| `gotas` | Gotas | tomar |
| `pomada` | Pomada | aplicar |
| `creme` | Creme | aplicar |
| `pasta` | Pasta | aplicar |
| `spray` | Spray/aerossol | aplicar |

## `administrationRoute`
- Via de administração.
- Valores permitidos: `'oral'` | `'sublingual'` | `'topica'`

## `quantity`
- Número de unidades por dose. Mínimo: 1.

## `intervalHours`
- Intervalo entre doses em horas. Mínimo: 1.

## `durationDays`
- Duração do tratamento em dias.
- Opcional, mas obrigatório se `whilePain` não for `true`.
- Regra de validação: `durationDays` OU `whilePain: true` deve estar presente.

## `whilePain`
- Se `true`, a posologia usa "enquanto houver dor" como duração.
- Mutuamente exclusivo com `durationDays` na prática (um ou outro define a duração).

## `defaultDosage`
- Texto de posologia gerado automaticamente pela função `generateDosage()`.
- Exemplo gerado: `"tomar 1 comprimido via oral a cada 8 horas por 7 dias"`
- Sempre calculado no repository — nunca digitado manualmente.

---

# Access Control

| Ação | Quem pode |
|---|---|
| Ler qualquer medicine | Qualquer usuário autenticado |
| Criar medicine | Apenas admin |
| Atualizar medicine | Apenas admin |
| Deletar medicine | Apenas admin |

---

# Structural Rules (MANDATORY)

1. `nameNormalized` e `defaultDosage` são sempre gerados no repository.
2. Todo medicine deve ter `durationDays` ou `whilePain: true` — nunca os dois ausentes.
3. Nunca salvar string vazia — usar `null` ou omitir campos opcionais.
4. Nunca criar campo `ownerId` em medicines — o catálogo é global.
5. `quantity` e `intervalHours` nunca podem ser menores que 1.

---

# Prohibited for Claude / Any AI

- Criar campo `ownerId` em medicines.
- Permitir que dentista crie ou edite medicines.
- Salvar `defaultDosage` vindo do front — sempre recalcular no repository.
- Salvar string vazia em campos nullable.

Alterações estruturais exigem incremento de versão.
