# Backend Architecture & Data Planning

This document outlines the Firestore data models and implementation strategy to support the "SmartRide AI" features as defined in the UI design.

## 1. Firestore Data Models

### `users` (Collection)
Primary user data and settings.
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "photoURL": "string",
  "preferences": {
    "theme": "dark-ai | midnight | aurora | ocean | sunset | light",
    "language": "string",
    "textSize": "number"
  },
  "commuteProfile": {
    "home": { "address": "string", "coords": "GeoPoint" },
    "office": { "address": "string", "coords": "GeoPoint" },
    "startTime": "HH:mm",
    "endTime": "HH:mm",
    "transport": "car | bike | train",
    "workMode": "office | hybrid | remote"
  },
  "savedPlaces": [
    { "id": "uuid", "name": "string", "address": "string", "coords": "GeoPoint", "type": "home | work | other" }
  ],
  "emergencyContacts": [
    { "name": "string", "phone": "string" }
  ]
}
```

### `rides` (Collection)
Tracking ride requests, active journeys, and historical data.
```json
{
  "userId": "string",
  "driverId": "string (optional)",
  "rideType": "smart | ev | eco",
  "status": "searching | confirmed | ongoing | completed | cancelled",
  "pickup": { "address": "string", "coords": "GeoPoint" },
  "dropoff": { "address": "string", "coords": "GeoPoint" },
  "price": "number",
  "eta": "string",
  "aiInsights": {
    "latency": "number (ms)",
    "confidence": "number (0-1)",
    "agents": "number",
    "hewro": { "walkingReduced": "number", "effortSaved": "number" },
    "stability": { "road": "number", "vehicle": "number", "route": "number" }
  },
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### `chats` (Collection)
Real-time messaging between matched commuters.
```json
{
  "participants": ["uid1", "uid2"],
  "lastMessage": "string",
  "updatedAt": "Timestamp",
  "messages": [
    { "text": "string", "senderId": "string", "timestamp": "Timestamp" }
  ]
}
```

---

## 2. Feature-Specific Logic

### AI Matching Logic (Smart Commute)
*   **Trigger**: When a user saves their `commuteProfile`.
*   **Process**: Query other users with similar `office` coordinates (within 1km) and similar `startTime` (within 15 mins).
*   **Output**: Populate a `potentialMatches` sub-collection for the user to display in `CommuteMatchResults.jsx`.

### Explainable AI Insights
*   **Generation**: During the `createRideRequest` call, the system (simulated) calculates route permutations.
*   **Storage**: Save the result in the `aiInsights` field of the ride document.
*   **UI**: The `ExplainableAI.jsx` page subscribes to the active ride and visualizes these stored metrics.

### Human Effort Weighting (HEWRO)
*   **Logic**: Prioritize multi-modal routes where the walk between Metro and Cab is less than 300m.
*   **Data**: Store `walkingDistance` and `waitingTime` in the ride object.

---

## 3. Implementation Phases

1.  **Phase 1: Profile & Settings (Active)**
    *   Implement CRUD for `savedPlaces` and `emergencyContacts`.
    *   Update `AuthContext` to persistent preferences.

2.  **Phase 2: Ride & Real-time (Next)**
    *   Implement real-time status tracking in `Activity.jsx` using `subscribeToRide`.
    *   Generate mock `aiInsights` for every new ride request.

3.  **Phase 3: Smart Commute & Chat**
    *   Implement "Connect" functionality that creates a document in `chats`.
    *   Build a real-time message listener for `CommuteChat.jsx`.
