// src/config.js
// Local configuration placeholders for Success Partners Gateway
// IMPORTANT:
// - Do NOT store secrets (client secrets, API keys) in this file for production.
// - Use this file only as a local/dev helper. Put real secrets in environment variables (Vercel/Netlify) or secret manager.

const CONFIG = {
  // Super Admin (initial) - can be an email or array of emails
  superAdminEmail: "g774000655@gmail.com",

  // UI defaults
  ui: {
    defaultLanguage: "ar",
    defaultTheme: "dark", // 'dark' | 'light'
  },

  // Firebase placeholders (replace via environment / firebase init)
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID",
  },

  // Integrations placeholders - put real keys in env vars on the host
  integrations: {
    googleOAuthClientId: "YOUR_GOOGLE_OAUTH_CLIENT_ID",
    openAIKeyEnvName: "OPENAI_API_KEY", // name of env variable on serverless host
    twilio: {
      accountSidEnvName: "TWILIO_ACCOUNT_SID",
      authTokenEnvName: "TWILIO_AUTH_TOKEN",
      fromNumber: "whatsapp:+1234567890"
    },
    socialLinks: {
      instagram: "",
      facebook: "",
      x: "",
      telegram: "",
      youtube: ""
    }
  }
};

export default CONFIG;
