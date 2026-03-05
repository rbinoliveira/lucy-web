# Lucy — Firestore Structure
## Module: Prescriptions
Version: 1.0

---

# Visão Geral

Uma prescrição representa a indicação de um único medicamento a um paciente específico, criada pelo dentista. Cada prescrição é independente — se o dentista prescrever 3 medicamentos, são 3 documentos separados.

---

# Collection Path

```
prescriptions/{prescriptionId}
```

---

# Document Structure

```ts
export type PrescriptionStatus = 'active' | 'finished' | 'cancelled'

export type PrescriptionModel = {
  id: string
  patientId: string               // UID do paciente em users/{patientId}
  patientEmail: string            // Desnormalizado — cópia do email do paciente
  patientName: string             // Desnormalizado — cópia do nome do paciente
  patientNameNormalized: string   // Normalizado para busca (sem acentos, lowercase)
  medicineId: string              // ID do medicine em medicines/{medicineId}
  medicineName: string            // Desnormalizado — cópia do nome do medicine
  medicineNameNormalized: string  // Normalizado para busca (sem acentos, lowercase)
  dosage: string                  // Posologia (gerada ou editada pelo dentista)
  durationDays?: number | null    // Duração em dias (opcional se durationDescription presente)
  durationDescription?: string | null  // Duração em texto livre (ex: "enquanto houver dor")
  notes?: string | null           // Observações adicionais do dentista
  ownerId: string                 // UID do dentista que criou
  status: PrescriptionStatus
  createdAt?: Date | string
  updatedAt?: Date | string
}
```

---

# Field Definitions

## `id`
- UUID gerado no repository.
- Imutável após criação.

## `patientId`
- UID do paciente em `users/{patientId}` com `role: 'patient'`.
- O paciente deve pertencer ao mesmo dentista (`patient.ownerId == prescription.ownerId`).
- Imutável após criação.

## `patientEmail` / `patientName`
- Campos desnormalizados copiados do documento do paciente no momento da criação.
- Evitam consultas adicionais ao Firestore para exibir a prescrição.
- Não são atualizados automaticamente se o paciente alterar nome ou email.

## `medicineId`
- ID do medicine em `medicines/{medicineId}`.
- Imutável após criação.

## `medicineName`
- Campo desnormalizado copiado do medicine no momento da criação.
- Não é atualizado automaticamente se o medicine for editado.

## `dosage`
- Posologia da prescrição.
- Por padrão, preenchida com o `defaultDosage` do medicine selecionado.
- O dentista pode editar livremente antes de salvar.

## `durationDays`
- Duração numérica em dias.
- Opcional — pode ser `null` se `durationDescription` estiver presente.

## `durationDescription`
- Duração em texto livre. Ex: `"enquanto houver dor"`, `"uso contínuo"`.
- Opcional — pode ser `null` se `durationDays` estiver presente.

## `notes`
- Observações livres do dentista. Completamente opcional.

## `ownerId`
- UID do dentista que criou a prescrição.
- Imutável após criação.
- Nunca pode ser `null`.

## `status`
- Estado atual da prescrição.

| Valor | Significado |
|---|---|
| `'active'` | Prescrição em uso pelo paciente |
| `'finished'` | Tratamento concluído |
| `'cancelled'` | Prescrição cancelada pelo dentista |

---

# Access Control

| Ação | Quem pode |
|---|---|
| Ler prescrição | Dentista dono (`ownerId == uid`) ou admin |
| Criar prescrição | Dentista autenticado ou admin |
| Atualizar prescrição | Dentista dono ou admin |
| Deletar prescrição | Dentista dono ou admin |

---

# Structural Rules (MANDATORY)

1. Nunca criar prescrição sem `ownerId`.
2. Nunca criar prescrição sem `patientId`.
3. O `patientId` deve referenciar um paciente com `ownerId == prescription.ownerId`.
4. `ownerId` é imutável após criação.
5. Dentista nunca pode ler prescrições de outro dentista.
6. `patientName`, `patientEmail` e `medicineName` são copiados no momento da criação e não sincronizados depois.
7. Nunca salvar string vazia — usar `null`.

---

# Prohibited for Claude / Any AI

- Criar prescrição sem `ownerId`.
- Criar prescrição onde `patientId` pertence a outro dentista.
- Permitir dentista acessar prescrições de outro dentista.
- Criar campo `clinicId`.
- Sincronizar automaticamente `patientName`/`medicineName` após criação.

Alterações estruturais exigem incremento de versão.

---

# 🧩 Regras Operacionais Web (distribuído de business-rules)

- Cada prescrição representa uma única indicação para um paciente.
- Campos obrigatórios de vínculo no fluxo web atual: `patientId`, `patientEmail`, `patientName`, `medicineId`, `medicineName`, `ownerId`, `dosage`.
- O campo de paciente pode ser pré-preenchido via query string (`patientName`) ao abrir `/prescricoes/adicionar`.
- O dentista não pode operar prescrições de outro dentista (isolamento por `ownerId`).

# 🧪 Definições de Teste E2E (comportamentais)

- O usuário deve visualizar erro de obrigatoriedade de paciente, medicamento e posologia ao salvar vazio na URL `/prescricoes/adicionar`.
- O usuário deve abrir a URL `/prescricoes/adicionar?patientName={nome}` e visualizar o campo de paciente pré-preenchido com o nome informado.
- O usuário deve listar prescrições na URL `/prescricoes` filtradas pelo `ownerId` do usuário autenticado.
