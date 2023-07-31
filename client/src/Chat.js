import React, { useEffect, useState, useRef } from "react";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const chatBottomRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        owner: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("sendMsg", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  // listen for any changes in socket server, and call
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  //scroll to bottom
  useEffect(() => {
    chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <p>Chat Room</p>
      </div>
      <div className="chat-body">
        <div className="message-container" ref={chatBottomRef}>
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.owner ? "you" : "other"}
              >
                <div className="inside-message">
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-information">
                    <p id="time">{messageContent.time}</p>
                    <p id="owner">{messageContent.owner}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>Go</button>
      </div>
    </div>
  );
}

export default Chat;
