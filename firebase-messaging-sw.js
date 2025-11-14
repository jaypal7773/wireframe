import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-sw.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD_ezIQXT3stA4t1z6OZPMdtn9VbalFppo",
  authDomain: "wireframes-1552b.firebaseapp.com",
  projectId: "wireframes-1552b",
  messagingSenderId: "1030762362795",
  appId: "1:1030762362795:web:6ec598f35186adf13784ee",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Background messages
onBackgroundMessage(messaging, (payload) => {
  console.log("Received background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});
