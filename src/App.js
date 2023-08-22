import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const App = () => {
  //States
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [username, setUsername] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [chatMsg, setChatMsg] = useState([
    {
      user: "bot",
      message: "How can I help you ?",
    },
  ]);
  const lastMessage = useRef(null);

  const handleLogin = (username) => {
    setLoggedInUser(username);
  };

  //Handle submits
  const handleSubmit = async () => {
    if (messageCount >= 25) {
      console.log("You have reached the message limit.");
      return;
    }

    setLoading(true);
    let newMessage = [...chatMsg, { user: "me", message: `${inputMessage}` }];
    setChatMsg(newMessage);
    setInputMessage("");
    setMessageCount((prevCount) => prevCount + 1);
    const message = newMessage.map((msg) => msg.message).join("\n");
    const url = "http://localhost:5000/api";
    const requestBody = {
      // Customize your request body here
      user: loggedInUser, // For example, include the logged-in user's information
      message: message,
    };

    try {
      const response = await axios.post(
        url,
        requestBody // Use the customized request body
      );

      if (response.status === 200) {
        const data = response.data;
        setChatMsg([
          ...newMessage,
          { user: "bot", message: `${data.message}` },
        ]);
      } else {
        console.log("Error: Unexpected response status", response.status);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error:", error);
    }
  };

  //oneKeydown
  const onKeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };
  // Clear Chat
  const clearChat = () => {
    setChatMsg([]);
    setMessageCount(0);
  };
  //Handlescrolling
  useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMsg]);
  // formatTime
  const formatTime = () => {
    const date = new Date();
    return `${date.toString()}`;
  };
  const bot_image =
    "https://t3.ftcdn.net/jpg/05/22/82/20/360_F_522822085_1SNuRq0v537YnZ9xPAoBX5jxxw5qioPQ.jpg";
  const user_image =
    "https://previews.123rf.com/images/tanyastock/tanyastock1803/tanyastock180300490/97923644-user-icon-avatar-login-sign-circle-button-with-soft-color-gradient-background-vector.jpg";
  return (
    <div className="App">
      {loggedInUser ? (
        <div className="container py-5">
          <div className="row d-flex justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-6">
              <div className="card" id="chat2">
                <div className="card-header d-flex justify-content-between align-items-center p-3">
                  <h5 className="mb-0">
                    Dream-Chat -
                    <img
                      src={bot_image}
                      alt="avatar 1"
                      style={{ width: 45, height: "100%" }}
                    />{" "}
                  </h5>
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    data-mdb-ripple-color="dark"
                    onClick={clearChat}
                  >
                    Clear Chat
                  </button>
                </div>
                <div
                  className="card-body"
                  data-mdb-perfect-scrollbar="true"
                  style={{ position: "relative", height: 400 }}
                >
                  {chatMsg.map((msg, index) => {
                    // console.log(msg);
                    return (
                      <div key={index}>
                        {msg.user === "me" ? (
                          <div className="d-flex flex-row justify-content-start">
                            <img
                              src={user_image}
                              alt="avatar 1"
                              style={{ width: 45, height: "100%" }}
                            />
                            <div>
                              <p
                                className="small p-2 ms-3 mb-1 rounded-3"
                                style={{ backgroundColor: "#f5f6f7" }}
                              >
                                {msg.message}
                              </p>
                              <p className="small me-3 mb-3 rounded-3 text-muted">
                                {formatTime()}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                            <div>
                              <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                {msg.message}
                              </p>

                              <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                                {formatTime()}
                              </p>
                            </div>
                            <img
                              className="rounded-circle rounded "
                              src={bot_image}
                              alt="avatar 1"
                              style={{ width: 45, height: "100%" }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* {Into view last message} */}
                  <div ref={lastMessage} />
                </div>

                <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                  <img
                    src={user_image}
                    alt="avatar 3"
                    style={{ width: 50, height: "100%" }}
                  />
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="exampleFormControlInput1"
                    placeholder={
                      messageCount >= 25
                        ? "Message limit reached"
                        : "Type message..."
                    }
                    value={inputMessage}
                    onKeyDown={onKeydown}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={messageCount >= 25}
                  />
                  {loading ? (
                    "Chitti Typing..."
                  ) : (
                    <a className="ms-3" href="#!" onClick={handleSubmit}>
                      <i className="fas fa-paper-plane" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="login-page">
          <div className="login-form">
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={() => handleLogin(username)}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
