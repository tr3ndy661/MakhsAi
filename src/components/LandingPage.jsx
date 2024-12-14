import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <section id="hero" className="hero">
      <nav className="navbar">
        <div className="logo">Makhs-AI</div>
        <div className="nav-links">
          <a href="#benefits">Benefits</a>
          <a href="#generators">Generators</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#creator">Creator</a>
        </div>
      </nav>

      <div className="hero-content">
        <h1>Artifical Intelligence<br/>Reimagined</h1>
        <p>Stop paying to use AI</p>
      </div>
      
      <div className="hero-phone">
        <div className="phone-frame">
          <div className="phone-content">
            <div className="phone-header">
              <h3>Makhs-AI</h3>
            </div>
            <div className="chat-bubble user">
              How can AI help me with my work?
            </div>
            <div className="chat-bubble ai">
              Our AI can help you with any task. From content creation to data analysis, we've got you covered. Try it now for free!
            </div>
            <div className="message-input">
              <input type="text" placeholder="Type a message..." />
              <button className="send-btn">→</button>
            </div>
          </div>
        </div>
      </div>

      <div className="disclaimer">
        * This website is currently under development. The current version does not represent the final product.
      </div>
    </section>
  );
};

export default LandingPage;
