const firebaseConfig = {
  apiKey: "AIzaSyB-xF9PIjuFc81WewSX8BgLaEoK1PO5P1E",
  authDomain: "skip-4d58d.firebaseapp.com",
  projectId: "skip-4d58d",
  storageBucket: "skip-4d58d.firebasestorage.app",
  messagingSenderId: "291052427486",
  appId: "1:291052427486:web:06c20ffaa244c273354a4f"
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
