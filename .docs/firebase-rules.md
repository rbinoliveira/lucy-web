rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Superadmin: único email autorizado a promover outros usuários para admin.
    function isSuperAdmin() {
      return request.auth != null && request.auth.token.email == 'dramluisabraga@gmail.com';
    }

    // Admin: superadmin OU qualquer usuário com role == 'admin' no Firestore.
    function isAdmin() {
      return isSuperAdmin() || (
        request.auth != null &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }

    function isAuthenticated() {
      return request.auth != null;
    }

    // Users: dentistas, admins e pacientes na mesma collection.
    // Isolamento via ownerId (para pacientes) e request.auth.uid (para dentistas/admins).
    match /users/{userId} {

      // Leitura: próprio doc | pacientes do dentista (ownerId) | admin
      allow read: if isAuthenticated() && (
        request.auth.uid == userId ||
        resource.data.ownerId == request.auth.uid ||
        isAdmin()
      );

      // Criação: próprio doc | criando paciente com ownerId == uid | admin
      allow create: if isAuthenticated() && (
        request.auth.uid == userId ||
        request.resource.data.ownerId == request.auth.uid ||
        isAdmin()
      );

      // Atualização:
      // - Próprio usuário: não pode alterar role, isActive nem deletedAt.
      // - Dentista dono: pode atualizar paciente próprio (role == 'patient').
      // - Admin: pode atualizar qualquer doc, mas só superadmin pode setar role == 'admin'.
      allow update: if isAuthenticated() && (
        (request.auth.uid == userId &&
          !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isActive', 'deletedAt'])) ||
        (resource.data.ownerId == request.auth.uid && resource.data.role == 'patient') ||
        (isAdmin() && (request.resource.data.role != 'admin' || isSuperAdmin()))
      );

      // Exclusão: admin | próprio doc | dono do paciente
      allow delete: if isAuthenticated() && (
        isAdmin() ||
        request.auth.uid == userId ||
        resource.data.ownerId == request.auth.uid
      );
    }

    // Prescriptions: ownerId = dentista. Apenas dono ou admin.
    match /prescriptions/{prescriptionId} {
      allow read: if isAuthenticated() && (
        resource.data.ownerId == request.auth.uid || isAdmin()
      );

      allow create: if isAuthenticated() && (
        request.resource.data.ownerId == request.auth.uid || isAdmin()
      );

      allow update, delete: if isAuthenticated() && (
        resource.data.ownerId == request.auth.uid || isAdmin()
      );
    }

    // Medicines: catálogo global. Leitura para todos autenticados; escrita exclusiva do admin.
    match /medicines/{medicineId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
  }
}
