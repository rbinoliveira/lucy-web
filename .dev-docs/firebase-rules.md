rules_version = '2';

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

    match /prescriptions/{prescriptionId} {
      allow read: if isAuthenticated()
        && (resource.data.ownerId == request.auth.uid || isAdmin());

      allow create: if isAuthenticated()
        && (request.resource.data.ownerId == request.auth.uid || isAdmin());

      allow update, delete: if isAuthenticated()
        && (resource.data.ownerId == request.auth.uid || isAdmin());
    }

    match /medicines/{medicineId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
  }
}
