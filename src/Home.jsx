import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "./context/ProgressContext";
import { useUser } from "./context/UserContext";
import "./Home.css";

import formIcon from "./assets/form.png";
import aiIcon from "./assets/ai.png";
import learningIcon from "./assets/learning.png";

const mbtiTypes = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

function Home() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  // 🔹 ดึง progress จาก Context (คำนวณให้แล้ว)
  const { visualProgress } = useProgress();
  const { updateUserData } = useUser();

  const handleNext = () => {
    if (!selected) return;
    updateUserData("mbti", selected);
    navigate("/aptitude");
  };

  return (
    <div className="home-container">
      {/* ================= Hero ================= */}
      <h1 className="hero-title">
        ค้นหาอาชีพที่ใช่สำหรับคุณ <br />
        ด้วยเทคโนโลยี AI
      </h1>

      {/* ================= Progress (แบบสอบถาม) ================= */}
      <div className="progress-container">
        {/* เส้น progress (จำกัดอยู่ใน step แบบสอบถาม) */}
        <div className="progress-line">
          <div
            className="progress-line-fill"
            style={{ width: `${visualProgress}%` }}
          />
        </div>

        {/* Step: แบบสอบถาม (active ตลอดช่วง survey) */}
        <div className="progress-step active">
          <div className="progress-circle">
            <img src={formIcon} alt="แบบสอบถาม" />
          </div>
          <span>แบบสอบถาม</span>
        </div>

        {/* Step: อาชีพ AI (ยังไม่ active) */}
        <div className="progress-step">
          <div className="progress-circle">
            <img src={aiIcon} alt="อาชีพที่ AI แนะนำ" />
          </div>
          <span>อาชีพที่ AI แนะนำ</span>
        </div>

        {/* Step: Learning Path */}
        <div className="progress-step">
          <div className="progress-circle">
            <img src={learningIcon} alt="Learning Path" />
          </div>
          <span>Learning Path</span>
        </div>
      </div>

      {/* ================= MBTI Card ================= */}
      <div className="mbti-card">
        <h2>แบบสอบถาม MBTI</h2>

        <div className="mbti-grid">
          {mbtiTypes.map((type) => (
            <button
              key={type}
              className={`mbti-btn ${selected === type ? "active" : ""}`}
              onClick={() => setSelected(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="mbti-footer">
          <span
            className="mbti-link"
            onClick={() => navigate("/formmbti")}
          >
            ถ้ายังไม่รู้ MBTI ตัวเอง
          </span>

          <button
            className="next-btn"
            disabled={!selected}
            onClick={handleNext}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
