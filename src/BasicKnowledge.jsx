import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext.jsx";
import "./BasicKnowledge.css";

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:4546'}/api`;

import formIcon from "./assets/form.png";
import aiIcon from "./assets/ai.png";
import learningIcon from "./assets/learning.png";

function BasicKnowledge() {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    const finalPayload = {
      mbti: userData.mbti,
      aptitude: userData.aptitudeScores,
      knowledge: textInput,
    };

    console.log("กำลังส่งข้อมูล...");
    setIsLoading(true);

    try {
      // 2. ยิง API ไปหา Backend (สมมติว่า Backend รันที่ port 3000)
      const response = await fetch(`${API_BASE}/career-recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });

      const data = await response.json();

      // 3. Save result to localStorage to persist the career list
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser?.id || localStorage.getItem('user_id');
      const storageKey = userId ? `recommendedCareers_${userId}` : 'recommendedCareers_guest';
      localStorage.setItem(storageKey, JSON.stringify(data));

      // 4. ไปหน้าผลลัพธ์
      navigate("/career-list", { state: { result: data } });

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI");
    } finally {
      setIsLoading(false);
    }
  };

  const skills = [
    "Hard Skill",
    "Soft Skill",
    "Creative Skill",
    "Technical Skill",
  ];

  return (
    <div className="home-container">
      {/* ================= Hero ================= */}
      <h1 className="hero-title">
        ค้นหาอาชีพที่ใช่สำหรับคุณ <br />
        ด้วยเทคโนโลยี AI
      </h1>

      {/* ================= Progress (ยังอยู่ Step แบบสอบถาม) ================= */}
      <div className="progress-container">
        <div className="progress-line">
          {/*  ใกล้จบแบบสอบถาม แต่ยังไม่ข้าม step */}
          <div className="progress-line-fill progress-30" />
        </div>

        {/* Step 1 : แบบสอบถาม (ACTIVE) */}
        <div className="progress-step active">
          <div className="progress-circle">
            <img src={formIcon} alt="แบบสอบถาม" />
          </div>
          <span>แบบสอบถาม</span>
        </div>

        {/* Step 2 : อาชีพ AI */}
        <div className="progress-step">
          <div className="progress-circle">
            <img src={aiIcon} alt="AI Career" />
          </div>
          <span>อาชีพที่ AI แนะนำ</span>
        </div>

        {/* Step 3 : Learning Path */}
        <div className="progress-step">
          <div className="progress-circle">
            <img src={learningIcon} alt="Learning Path" />
          </div>
          <span>Learning Path</span>
        </div>
      </div>

      {/* ================= Knowledge Card ================= */}
      <div className="knowledge-card">
        <h2>แบบสอบถาม ความรู้พื้นฐาน</h2>
        <p className="knowledge-card-subtitle">ความรู้พื้นฐานของคุณมีอะไรบ้าง </p>

        {/* Skill Tags */}
        <div className="skill-group">
          {skills.map((skill) => (
            <div key={skill} className="skill-box">
              {skill}
            </div>
          ))}
        </div>


        <textarea
          className="knowledge-textarea"
          placeholder="บอกเราเกี่ยวกับความรู้และทักษะที่คุณมี เช่น พื้นฐาน Python และ Data Analysis เคยใช้งาน Excel และ SQL หรือ สนใจด้าน AI และ Machine Learning"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          disabled={isLoading}
        />

        <div className="knowledge-footer">
          <button
            className="back-btn"
            onClick={() => navigate("/Aptitude")}
            disabled={isLoading}
          >
            ย้อนกลับ
          </button>

          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "กำลังประมวลผล..." : "ยืนยัน"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BasicKnowledge;
