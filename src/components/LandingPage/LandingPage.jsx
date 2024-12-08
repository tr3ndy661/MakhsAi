import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import CustomCursor from "../CustomCursor/CustomCursor";
import TypeWriter from "../TypeWriter/TypeWriter";
import "./LandingPage.css";

const LandingPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedAI, setSelectedAI] = useState(null);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const isScrolled = useScrollAnimation();

  useEffect(() => {
    window.scrollTo(0, 0);

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      document.body.style.overflow = "";
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".glass-card");

    const handleMouseMove = (e) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove);
      });
    };
  }, []);

  const handleCardClick = (cardId, title, points) => {
    setSelectedCard({ id: cardId, title, points });
    document.body.style.overflow = "hidden";
  };

  const handleModalClose = () => {
    const overlay = document.querySelector(".modal-overlay");
    overlay.classList.add("closing");

    overlay.addEventListener(
      "animationend",
      () => {
        setSelectedCard(null);
        document.body.style.overflow = "";
      },
      { once: true }
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'benefits', 'generators', 'testimonials'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      <CustomCursor />
      <nav className={`nav-wrapper ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-content">
          <a href="#" className="nav-logo animate">
            Makhs-A\
          </a>
          <div className="nav-menu">
            <a
              href="#benefits"
              className={`nav-link ${
                activeSection === "benefits" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick(e, '#benefits')}
            >
              Benefits
            </a>
            <a
              href="#generators"
              className={`nav-link ${
                activeSection === "generators" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick(e, '#generators')}
            >
              Generators
            </a>
            <a
              href="#testimonials"
              className={`nav-link ${
                activeSection === "testimonials" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick(e, '#testimonials')}
            >
              Testimonials
            </a>
            <a
              href="#creator"
              className={`nav-link ${activeSection === 'creator' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, '#creator')}
            >
              Creator
            </a>
            <button className="nav-button sign-in">Sign In</button>
            <button className="nav-button sign-up">Sign Up</button>
          </div>
        </div>
      </nav>

      <div className="content-wrapper">
        <section id="hero" ref={heroRef} className="hero">
          <div className="hero-content">
            <h1>Artifical Intelligence Reimagined</h1>
            <p>Stop paying to use A\</p>
            <a href="https://makhs-ai.vercel.app/" className="get-started-link">
              Get started now completely free →
            </a>
          </div>
          <TypeWriter />
        </section>

        <div className="line-container">
          <div className="horizontal-line"></div>
        </div>

        <section id="benefits" className="benefits">
          <h2>Benefits</h2>
          <div className="benefits-grid">
            <div className="glass-card">
              <div className="card-content">
                <h3>No Monthly Fees</h3>
                <ul className="benefits-list">
                  <li>Completely free to use</li>
                  <li>No credit card required</li>
                  <li>No hidden costs or premium tiers</li>
                  <li>Unlimited AI interactions</li>
                  <li>Access to all features</li>
                </ul>
              </div>
              <div className="card-shine"></div>
            </div>

            <div className="glass-card">
              <div className="card-content">
                <h3>Complete Anonymity</h3>
                <ul className="benefits-list">
                  <li>No sign-up required</li>
                  <li>No data collection</li>
                  <li>No conversation tracking</li>
                  <li>Secure chat environment</li>
                  <li>Privacy-first approach</li>
                </ul>
              </div>
              <div className="card-shine"></div>
            </div>

            <div className="glass-card">
              <div className="card-content">
                <h3>Advanced AI Features</h3>
                <ul className="benefits-list">
                  <li>Superior text generation</li>
                  <li>Context-aware responses</li>
                  <li>Multiple AI personalities</li>
                  <li>Fast response times</li>
                  <li>Natural conversations</li>
                </ul>
              </div>
              <div className="card-shine"></div>
            </div>

            <div className="glass-card">
              <div className="card-content">
                <h3>User Experience</h3>
                <ul className="benefits-list">
                  <li>Clean, modern interface</li>
                  <li>Mobile-friendly design</li>
                  <li>Easy to use platform</li>
                  <li>24/7 availability</li>
                  <li>No installation needed</li>
                </ul>
              </div>
              <div className="card-shine"></div>
            </div>

            <div className="glass-card">
              <div className="card-content">
                <h3>Customization</h3>
                <ul className="benefits-list">
                  <li>Personalized AI responses</li>
                  <li>Adjustable conversation style</li>
                  <li>Custom AI personalities</li>
                  <li>Flexible chat settings</li>
                  <li>Theme customization</li>
                </ul>
              </div>
              <div className="card-shine"></div>
            </div>

            <div className="glass-card">
              <div className="card-content">
                <h3>Performance</h3>
                <ul className="benefits-list">
                  <li>Instant response time</li>
                  <li>High accuracy outputs</li>
                  <li>Stable connection</li>
                  <li>Low latency</li>
                  <li>Optimized processing</li>
                </ul>
              </div>
              <div className="card-shine"></div>
            </div>
          </div>

          {selectedCard && (
            <div className="modal-overlay" onClick={handleModalClose}>
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h3>{selectedCard.title}</h3>
                <div className="modal-typewriter">
                  <Typewriter
                    options={{
                      delay: 30,
                      cursor: "|",
                      autoStart: true,
                    }}
                    onInit={(typewriter) => {
                      typewriter.pauseFor(400);
                      selectedCard.points.forEach((point, index, array) => {
                        typewriter.typeString(`• ${point}`).pauseFor(600);

                        if (index !== array.length - 1) {
                          typewriter.typeString("<br>").pauseFor(200);
                        }
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="line-container">
          <div className="horizontal-line"></div>
        </div>

        <section id="testimonials" className="testimonials">
          <h2>What Users Say</h2>
          
          <div className="testimonials-container">
            <div className="scroll-container">
              <div className="scroll-content">
                <div className="testimonial-card">
                  <p>"This AI has completely transformed how I work. The responses are incredibly natural and helpful."</p>
                  <span className="author">- Alex M.</span>
                </div>
                <div className="testimonial-card">
                  <p>"I love that it's completely free and private. No more expensive subscriptions!"</p>
                  <span className="author">- Sarah K.</span>
                </div>
                <div className="testimonial-card">
                  <p>"The speed and accuracy of responses are impressive. Best AI I've used so far."</p>
                  <span className="author">- James R.</span>
                </div>
                <div className="testimonial-card">
                  <p>"Finally, an AI that respects privacy and doesn't require sign-ups."</p>
                  <span className="author">- Emma L.</span>
                </div>
                <div className="testimonial-card">
                  <p>"The customization options are fantastic. It feels like having a personal assistant."</p>
                  <span className="author">- Michael P.</span>
                </div>
                <div className="testimonial-card">
                  <p>"The interface is so intuitive and clean. Makes other AI platforms look outdated."</p>
                  <span className="author">- Lisa T.</span>
                </div>
                <div className="testimonial-card">
                  <p>"Being able to use advanced AI features without paying is revolutionary. Thank you!"</p>
                  <span className="author">- David H.</span>
                </div>
                <div className="testimonial-card">
                  <p>"The response quality is consistently high. It understands context perfectly."</p>
                  <span className="author">- Rachel M.</span>
                </div>
                <div className="testimonial-card">
                  <p>"Love how it remembers conversation context. Makes interactions feel more natural."</p>
                  <span className="author">- Chris B.</span>
                </div>
                <div className="testimonial-card">
                  <p>"As a student, having free access to such powerful AI is incredible."</p>
                  <span className="author">- Tom W.</span>
                </div>
              </div>
              <div className="scroll-content" aria-hidden="true">
                {/* Duplicate all cards for seamless loop */}
                <div className="testimonial-card">
                  <p>"This AI has completely transformed how I work. The responses are incredibly natural and helpful."</p>
                  <span className="author">- Alex M.</span>
                </div>
                <div className="testimonial-card">
                  <p>"I love that it's completely free and private. No more expensive subscriptions!"</p>
                  <span className="author">- Sarah K.</span>
                </div>
                <div className="testimonial-card">
                  <p>"The speed and accuracy of responses are impressive. Best AI I've used so far."</p>
                  <span className="author">- James R.</span>
                </div>
                <div className="testimonial-card">
                  <p>"Finally, an AI that respects privacy and doesn't require sign-ups."</p>
                  <span className="author">- Emma L.</span>
                </div>
                <div className="testimonial-card">
                  <p>"The customization options are fantastic. It feels like having a personal assistant."</p>
                  <span className="author">- Michael P.</span>
                </div>
                <div className="testimonial-card">
                  <p>"The interface is so intuitive and clean. Makes other AI platforms look outdated."</p>
                  <span className="author">- Lisa T.</span>
                </div>
                <div className="testimonial-card">
                  <p>"Being able to use advanced AI features without paying is revolutionary. Thank you!"</p>
                  <span className="author">- David H.</span>
                </div>
                <div className="testimonial-card">
                  <p>"The response quality is consistently high. It understands context perfectly."</p>
                  <span className="author">- Rachel M.</span>
                </div>
                <div className="testimonial-card">
                  <p>"Love how it remembers conversation context. Makes interactions feel more natural."</p>
                  <span className="author">- Chris B.</span>
                </div>
                <div className="testimonial-card">
                  <p>"As a student, having free access to such powerful AI is incredible."</p>
                  <span className="author">- Tom W.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="line-container">
          <div className="horizontal-line"></div>
        </div>

        <section id="generators" className="generators">
          <div className="generators-content">
            <div className="title-container">
              <h2>Superior Generations</h2>
              <p>Better than the ones you pay for</p>
            </div>
            
            <div className="generators-box">
              <div className="selection-area">
                <select 
                  className="ai-dropdown"
                  onChange={(e) => setSelectedAI(e.target.value)}
                  value={selectedAI || ''}
                >
                  <option value="" disabled>Select AI Type</option>
                  <option value="chat">Chat-AI</option>
                  <option value="image">Image Generation-AI</option>
                </select>

                {selectedAI && (
                  <div className="ai-info">
                    {selectedAI === 'chat' ? (
                      <>
                        <h3>Chat-AI</h3>
                        <ul>
                          <li>Advanced conversational AI</li>
                          <li>Natural language understanding</li>
                          <li>Instant responses</li>
                          <li>No registration needed</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <h3>Image Generation-AI</h3>
                        <ul>
                          <li>Create unique images</li>
                          <li>High-resolution output</li>
                          <li>Multiple art styles</li>
                          <li>Commercial usage rights</li>
                        </ul>
                      </>
                    )}
                  </div>
                )}

                <a 
                  href={selectedAI === 'chat' ? 'https://makhs-ai.vercel.app/' : 'https://labs.openai.com/'}
                  className={`try-button ${selectedAI ? 'active' : ''}`}
                  onClick={(e) => !selectedAI && e.preventDefault()}
                >
                  Try Now
                  <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="line-container">
          <div className="horizontal-line"></div>
        </div>

        <section id="creator" className="creator">
          <div className="creator-content">
            <div className="creator-header">
              <h2 className="glitch-text">Meet the Creator</h2>
            </div>

            <div className="creator-card">
              <div className="creator-info">
                <div className="name-badge">
                  <span className="highlight">Abdelmoneim</span>
                  <span className="age">22 yo</span>
                </div>
                
                <div className="title-badge">
                  Frontend Developer & Creative Explorer
                </div>

                <div className="bio">
                  <p>
                    Hey there! I'm a passionate web developer who turns ideas into 
                    engaging digital experiences. With a keen eye for detail and a 
                    love for clean code, I create websites that not only look great 
                    but also perform exceptionally well.
                  </p>
                </div>

                <div className="skills-container">
                  <div className="skills-grid">
                    <div className="skill-item">
                      <span className="skill-icon">⚛️</span>
                      <span className="skill-name">React</span>
                    </div>
                    <div className="skill-item">
                      <span className="skill-icon">🎨</span>
                      <span className="skill-name">CSS</span>
                    </div>
                    <div className="skill-item">
                      <span className="skill-icon">📱</span>
                      <span className="skill-name">Responsive</span>
                    </div>
                    <div className="skill-item">
                      <span className="skill-icon">🚀</span>
                      <span className="skill-name">JavaScript</span>
                    </div>
                    <div className="skill-item">
                      <span className="skill-icon">📝</span>
                      <span className="skill-name">TypeScript</span>
                    </div>
                    <div className="skill-item">
                      <span className="skill-icon">🔄</span>
                      <span className="skill-name">Node.js</span>
                    </div>
                  </div>
                </div>

                <div className="philosophy">
                  <p>
                    "I believe in exploring new technologies and pushing creative boundaries 
                    to deliver exceptional web experiences."
                  </p>
                </div>

                <div className="contact-section">
                  <h3>Ready to build something amazing?</h3>
                  <a 
                    href="mailto:trendypotato661@gmail.com" 
                    className="contact-button"
                  >
                    Let's Work Together
                    <span className="button-arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
