const firebaseConfig = {
  apiKey: "AIzaSyBRN7k17JtwvbTJivpuPAdyv4NGR_J0tww",
  authDomain: "srchat-d9f03.firebaseapp.com",
  databaseURL: "https://srchat-d9f03-default-rtdb.firebaseio.com",
  projectId: "srchat-d9f03",
  storageBucket: "srchat-d9f03.appspot.com",
  messagingSenderId: "381081144538",
  appId: "1:381081144538:web:ecbfb57657bb80162f29e3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const PASSWORD = "072009";

// Check login
function checkLogin() {
  const name = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!name || !pass) return alert("Enter name and password");
  if (pass !== PASSWORD) return alert("Wrong password!");

  localStorage.setItem("chatUser", name);
  document.getElementById("login").style.display = "none";
  document.getElementById("chat-container").style.display = "flex";
  listenForMessages();
}

// Send message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const msg = input.value.trim();
  const user = localStorage.getItem("chatUser");

  if (msg && user) {
    db.ref("messages").push({
      text: msg,
      sender: user,
      status: "sent",
      timestamp: Date.now()
    });
    input.value = "";
  }
}

// Clear chat
function clearChat() {
  if (confirm("Clear chat for everyone?")) {
    db.ref("messages").remove();
  }
}

// Load messages and mark seen only by receiver
function listenForMessages() {
  const chatBox = document.getElementById("chatBox");
  const currentUser = localStorage.getItem("chatUser");

  db.ref("messages").on("value", snapshot => {
    const data = snapshot.val();
    chatBox.innerHTML = "";

    if (data) {
      for (let key in data) {
        const msg = data[key];
        const isSelf = msg.sender === currentUser;

        const div = document.createElement("div");
        div.className = "chat-message";
        div.classList.add(isSelf ? "self" : "other");

        const msgText = document.createElement("div");
        msgText.textContent = `${msg.sender}: ${msg.text}`;

        const status = document.createElement("div");
        status.className = "status";

        if (isSelf) {
          status.textContent = "? Sent";
        } else {
          if (msg.status !== "seen") {
            db.ref("messages/" + key).update({ status: "seen" });
          }
          status.textContent = "?? Seen";
        }

        div.appendChild(msgText);
        div.appendChild(status);
        chatBox.appendChild(div);
      }
    }

    chatBox.scrollTop = chatBox.scrollHeight;
  });
}