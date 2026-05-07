// ไฟล์: src/CareerList.jsx

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import "./CareerList.css"; // ✅ แก้ชื่อไฟล์ CSS ตรงนี้

// Import Icons (เหมือนเดิม)
import { BarChart, PenTool, Server, Cpu, Database, Briefcase } from "lucide-react";

function CareerList() { // ✅ เปลี่ยนชื่อฟังก์ชันเป็น CareerList
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Get user info to form storage key
  const storedUser = localStorage.getItem('user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.id || localStorage.getItem('user_id');
  const storageKey = userId ? `recommendedCareers_${userId}` : 'recommendedCareers_guest';

  // รับข้อมูลเหมือนเดิม หรือจาก localStorage
  let resultData = location.state?.result;
  if (!resultData) {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        resultData = JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse saved career data");
      }
    }
  }

  const careers = resultData?.recommended_careers || [];

  useEffect(() => {
    if (!resultData) {
      // navigate("/"); // เปิดบรรทัดนี้ถ้าต้องการบังคับ
    }
  }, [resultData, navigate]);

  const handleCareerClick = (career) => {
    setSelectedCareer(career);
    setShowConfirm(true);
  };

  const confirmLearningPath = () => {
    if (selectedCareer) {
      navigate(`/learningpath/${encodeURIComponent(selectedCareer.title)}`);
    }
  };

  const getIcon = (iconKey) => {
    switch (iconKey) {
      case "chart-bar": return <BarChart className="icon" />;
      case "pen-tool": return <PenTool className="icon" />;
      case "server": return <Server className="icon" />;
      case "cpu": return <Cpu className="icon" />;
      case "database": return <Database className="icon" />;
      default: return <Briefcase className="icon" />;
    }
  };

  return (
    <div className="career-list-page">
      <div className="home-container">
        <h1 className="hero-title">
          อาชีพที่แนะนำสำหรับคุณ <br />
          <span>จากการวิเคราะห์บุคลิกภาพ ความถนัด และความรู้พื้นฐาน</span>
        </h1>

        <div className="career-list-container">
          {careers.length > 0 ? (
            careers.map((career, index) => (
              <div key={career.id || index} className="career-card" onClick={() => handleCareerClick(career)}>

                <div className="career-icon-box">
                  {getIcon(career.icon_key)}
                </div>

                <div className="career-info">
                  <h3>{career.title}</h3>
                  <p>{career.short_description || career.description}</p>
                </div>

                <div className="arrow-icon">{">"}</div>
              </div>
            ))
          ) : (
            <div className="error-message">
              <p>ไม่พบข้อมูลผลลัพธ์ กรุณาทำแบบทดสอบใหม่อีกครั้ง</p>
              <button className="back-btn" onClick={() => navigate("/")}>กลับหน้าหลัก</button>
            </div>
          )}
        </div>

        <div className="footer-action">
          <button className="back-btn-outline" onClick={() => navigate("/home")}>
            ย้อนกลับ
          </button>
        </div>
      </div>

      {/* Modal Confirm */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="lp-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="lp-modal-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button className="lp-modal-close" onClick={() => setShowConfirm(false)}>
                <X size={18} />
              </button>

              <div className="lp-modal-icon-container">
                <div className="lp-modal-icon-bg" style={{ background: 'rgba(255, 107, 0, 0.1)', color: '#ff6b00' }}>
                  <AlertTriangle size={32} />
                </div>
              </div>

              <h2 className="lp-modal-title">ยืนยันเส้นทางอาชีพ</h2>
              <p className="lp-modal-message">
                คุณแน่ใจหรือไม่ที่จะเริ่มเส้นทาง <strong>{selectedCareer?.title}</strong>? <br />
                ความคืบหน้าของอาชีพเดิม (ถ้ามี) จะยังคงอยู่และไม่หายไป
              </p>

              <div className="lp-modal-actions">
                <button className="lp-modal-btn-secondary" onClick={() => setShowConfirm(false)}>
                  ยกเลิก
                </button>
                <button className="lp-modal-btn-danger" style={{ background: 'linear-gradient(135deg, #ff6b00, #ff8c33)', boxShadow: '0 4px 12px rgba(255, 107, 0, 0.25)' }} onClick={confirmLearningPath}>
                  ยืนยันเริ่มเรียน
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CareerList; // ✅ เปลี่ยน export เป็น CareerList