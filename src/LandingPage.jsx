import React from "react";
import { Link } from "react-router-dom";
import "./Landingpage.css";
import Navbar from "./Navbar";

import img1 from "./assets/Advocate_INFJ.png";
import img2 from "./assets/Debater_ENTP.png";
import img3 from "./assets/Logistician_ISTJ.png";
import img4 from "./assets/Commander_ENTJ.png";
import img5 from "./assets/Defender_ISFJ.png";
import img6 from "./assets/Logician_INTP.png";
import img7 from "./assets/Architect_INTJ.png";
import img8 from "./assets/Consul_ESFJ.png";
import playIcon from "./assets/play-icon.png";

function LandingPage() {
  const token = localStorage.getItem('token');
  const targetRoute = token ? "/home" : "/login";

  return (
    <div className="landing-page">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-text top">
          <h1>
            <span>รู้จักตัวเองหรือยัง?</span>
          </h1>
          <p>
            ค้นพบตัวตน บุคลิกภาพ และความถนัดของคุณ
          </p>

          <Link to={targetRoute} className="cta-btn">
            เริ่มต้นใช้งาน
          </Link>
        </div>

        <div className="character-row">
          <img src={img1} alt="char1" />
          <img src={img3} alt="char2" />
          <img src={img5} alt="char3" />
          <img src={img6} alt="char4" />
        </div>

        {/* ↓ SCROLL TO LEARNING */}
        <a href="#learning" className="scroll-down">
          <img src={playIcon} alt="scroll to learning" />
        </a>
      </section>

      {/* ===== LEARNING PATH SECTION ===== */}
      <section className="learning-section" id="learning">
        <div className="learning-content">
          
          {/* LEFT SIDE IMAGES */}
          <div className="learning-images">
            <img src={img2} alt="learning1" />
            <img src={img4} alt="learning2" />
          </div>

          {/* TEXT */}
          <div className="learning-text">
            <h2>ก้าวแรกของการเรียนรู้</h2>
            <p>
              ให้ Learning Path นำทางคุณจากพื้นฐาน สู่ความเชี่ยวชาญ
            </p>

            <Link to={targetRoute} className="play-btn">
              เริ่มต้นใช้งาน
            </Link>
          </div>
        </div>

        {/* ↓ SCROLL TO AI (อยู่ล่างสุดเหมือน Hero) */}
        <a href="#ai" className="scroll-down bottom">
          <img src={playIcon} alt="scroll to ai" />
        </a>
      </section>
      {/* ===== AI CAREER SECTION ===== */}
      <section className="ai-section" id="ai">
        <div className="ai-content">

          {/* TEXT LEFT */}
          <div className="ai-text">
            <h2>
              ค้นหาเส้นทางชีวิตที่เหมาะกับคุณ <span>ด้วยพลังของ AI</span>
            </h2>

            <p>
              ให้ AI ช่วยวิเคราะห์บุคลิก ความถนัด เพื่อแนะนำอาชีพที่เหมาะกับคุณ
            </p>

            <Link to={targetRoute} className="play-btn">
              เริ่มต้นใช้งาน
            </Link>
          </div>

          {/* IMAGES RIGHT */}
          <div className="ai-images">
            <img src={img7} alt="ai-char-1" />
            <img src={img8} alt="ai-char-2" />
          </div>

        </div>
      </section>
    </div>
  );
}

export default LandingPage;
