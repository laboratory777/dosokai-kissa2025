//js/firebase-config.js

// Firebaseの設定情報（自分のプロジェクトのものに書き換えてください）
const firebaseConfig = {
  apiKey: "AIzaSyBzl6UB-bN7BI58EZc1Mm2eTTYRDKWEnNo",
  authDomain: "dosokai-kissa.firebaseapp.com",
  projectId: "dosokai-kissa",
  storageBucket: "dosokai-kissa.firebasestorage.app",
  messagingSenderId: "165188890725",
  appId: "1:165188890725:web:b39e15c9798dc9fcef168c"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
