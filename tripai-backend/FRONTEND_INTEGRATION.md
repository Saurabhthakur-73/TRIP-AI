# 🔄 Frontend Ko Backend Se Kaise Jodte Hain

## 1. API Base URL Setup karo

`src/Service/` folder mein ek naya file banao: `api.js`

```javascript
// src/Service/api.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Token localStorage mein save karo (Firebase user ki jagah)
export const saveToken = (token) => localStorage.setItem("tripai_token", token);
export const getToken = () => localStorage.getItem("tripai_token");
export const removeToken = () => localStorage.removeItem("tripai_token");

// Auth Header helper
export const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export default API_BASE;
```

---

## 2. Google Login Update karo

**Pehle (Firebase):**
```javascript
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const result = await signInWithPopup(auth, new GoogleAuthProvider());
```

**Ab (MERN):**
```javascript
// Google One Tap / GSI use karo
// index.html mein add karo:
// <script src="https://accounts.google.com/gsi/client"></script>

import API_BASE, { saveToken, saveUser } from "./Service/api";

const handleGoogleLogin = async (credentialResponse) => {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential: credentialResponse.credential }),
  });
  const data = await res.json();
  if (data.success) {
    saveToken(data.token);
    localStorage.setItem("tripai_user", JSON.stringify(data.user));
    // Navigate to home
  }
};
```

---

## 3. Trip Create + AI Generate

**Pehle (Firebase):**
```javascript
// Frontend se directly Gemini call + Firestore save
const result = await chatSession.sendMessage(FINAL_PROMPT);
await setDoc(doc(db, "AITrips", docId), { ...data });
```

**Ab (MERN - 2 step):**
```javascript
import API_BASE, { authHeader } from "./Service/api";

// Step 1: AI se trip generate karo
const generateAndSaveTrip = async (formData) => {
  // AI generate karo
  const aiRes = await fetch(`${API_BASE}/ai/generate-trip`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      location: formData.location.label,
      noOfDays: formData.noOfDays,
      budget: formData.budget,
      noOfPeople: formData.noOfPeople,
    }),
  });
  const aiData = await aiRes.json();

  // Step 2: Trip MongoDB mein save karo
  const tripRes = await fetch(`${API_BASE}/trips`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      userSelection: formData,
      tripData: aiData.tripData,
    }),
  });
  const tripData = await tripRes.json();
  
  // Navigate to trip page
  navigate(`/view-trip/${tripData.trip._id}`);
};
```

---

## 4. My Trips Page

**Pehle (Firebase):**
```javascript
const q = query(collection(db, "AITrips"), where("userEmail", "==", user?.email));
const snapshot = await getDocs(q);
```

**Ab (MERN):**
```javascript
const fetchMyTrips = async () => {
  const res = await fetch(`${API_BASE}/trips/my-trips`, {
    headers: authHeader(),
  });
  const data = await res.json();
  setTrips(data.trips);
};
```

---

## 5. View Trip Page

**Pehle (Firebase):**
```javascript
const docRef = doc(db, "AITrips", tripId);
const docSnap = await getDoc(docRef);
```

**Ab (MERN):**
```javascript
const fetchTrip = async () => {
  const res = await fetch(`${API_BASE}/trips/${tripId}`, {
    headers: authHeader(),
  });
  const data = await res.json();
  setTripData(data.trip);
};
```

---

## 6. .env.local (Frontend ke liye)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
# Gemini key ab frontend mein NAHI chahiye (server pe hai)
```

---

## 🚀 Setup Steps

### Backend:
```bash
cd tripai-backend
npm install
cp .env.example .env
# .env mein apni values daalo
npm run dev
```

### MongoDB Atlas Setup:
1. mongodb.com pe jaao → Free cluster banao
2. Connect → Drivers → Connection string copy karo
3. `.env` mein `MONGODB_URI` mein daalo
4. Network Access → `0.0.0.0/0` allow karo

### Google Client ID:
1. console.cloud.google.com → APIs & Services → Credentials
2. OAuth 2.0 Client ID → Web Application
3. Authorized origins: `http://localhost:5173`, `http://localhost:5000`
4. Client ID ko `.env` mein daalo
