import React, { useState, useContext } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const {
    onSent,
    newChat,
    getRecentChats,
    switchToSession
  } = useContext(Context);

  const loadChat = async (sessionId) => {
    // Switch to the selected chat session
    switchToSession(sessionId);
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          src={assets.menu_icon}
          alt="menu"
          className="menu"
        />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent Chats</p>
            {getRecentChats().length > 0 ? (
              getRecentChats().map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className="recent-entry"
                >
                  <img src={assets.message_icon} alt="" />
                  <p className="recent-entry-p">
                    {chat.title.length > 18 
                      ? chat.title.slice(0, 18) + '...' 
                      : chat.title}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-recent-chats">No recent chats</p>
            )}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;