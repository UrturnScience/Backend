(function() {
  const messages = document.querySelector("#messages");
  const wsButton = document.querySelector("#wsButton");
  const wsSendButton = document.querySelector("#wsSendButton");
  const logout = document.querySelector("#logout");
  const login = document.querySelector("#login");
  const firebaseConfig = {
    apiKey: "AIzaSyCZ4FctPIWHvLMvcT9D7hsYZJyK6w4JDC8",
    authDomain: "basicmessagingapp-270623.firebaseapp.com",
    databaseURL: "https://basicmessagingapp-270623.firebaseio.com",
    projectId: "basicmessagingapp-270623",
    storageBucket: "basicmessagingapp-270623.appspot.com",
    messagingSenderId: "55696488133",
    appId: "1:55696488133:web:0ff32656cf22a8d2afe2ac",
    measurementId: "G-52RMPZ059L"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }

  function handleResponse(response) {
    return response.status === 200
      ? response.json().then(data => JSON.stringify(data, null, 2))
      : Promise.reject(new Error("Unexpected response"));
  }

  login.onclick = async function() {
    await firebase
      .auth()
      .signInWithEmailAndPassword("test@test.com", "testing");
    const token = await firebase.auth().currentUser.getIdToken();

    fetch("/user/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { Authorization: token }
    })
      .then(handleResponse)
      .then(showMessage)
      .catch(function(err) {
        showMessage(err.message);
      });
  };

  logout.onclick = function() {
    fetch("/user/logout", { method: "DELETE", credentials: "same-origin" })
      .then(handleResponse)
      .then(showMessage)
      .catch(function(err) {
        showMessage(err.message);
      });
  };

  let ws;

  wsButton.onclick = function() {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://${location.host}`);
    ws.onerror = function() {
      showMessage("WebSocket error");
    };
    ws.onopen = function() {
      showMessage("WebSocket connection established");
    };
    ws.onclose = function() {
      showMessage("WebSocket connection closed");
      ws = null;
    };

    ws.onmessage = function(data) {
      showMessage(data.data);
    };
  };

  wsSendButton.onclick = function() {
    if (!ws) {
      showMessage("No WebSocket connection");
      return;
    }

    ws.send("Hello World!");
    showMessage('Sent "Hello World!"');
  };
})();
