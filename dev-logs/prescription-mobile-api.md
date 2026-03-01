# Prescription data for mobile consumption

## Context

The dentist creates prescriptions in the web app. Patients consume prescription data in a mobile app. This document describes the prescription document shape and how to read it securely.

## Prescription document shape (Firestore / API)

Prescriptions are stored in the `prescriptions` collection. Each document contains:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Document ID |
| patientId | string | Patient document ID |
| patientEmail | string | Patient email |
| patientName | string | Patient full name |
| medicineId | string | Medicine document ID |
| medicineName | string | Medicine name |
| dosage | string | How to take (e.g. "1 comprimido de 8 em 8 horas") |
| durationDays | number \| null | Duration in days (optional) |
| durationDescription | string \| null | Duration as text (e.g. "Enquanto houver dor") (optional) |
| notes | string \| null | Additional notes for the patient (optional) |
| ownerId | string | Dentist (owner) user ID |
| status | string | `active` \| `finished` \| `cancelled` |
| createdAt | string | ISO date |
| updatedAt | string | ISO date |

For the mobile app, the relevant fields for the patient are: **medicineName**, **dosage**, **durationDays**, **durationDescription**, **notes**, and **status**.

## API access

- **List/detail**: Use the existing authenticated API (e.g. `GET /api/prescription/show/[id]`) or Firestore with security rules. Rules allow read only when `resource.data.ownerId == request.auth.uid` (dentist) or admin. The mobile app must use an auth context that identifies the patient (e.g. patient token or ownerId-scoped access) as defined by your mobile architecture.
- **Firestore rules**: See `firestore.rules`. Prescriptions are readable by the owner (dentist) and admin. If the mobile app reads Firestore directly, ensure the client is authenticated and only receives prescriptions allowed by your rules (e.g. via a backend or tenant-scoped token).

## References

- `src/features/prescription/models/prescription.model.ts` — model definition
- `firestore.rules` — Firestore security rules
