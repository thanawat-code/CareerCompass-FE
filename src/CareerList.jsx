// ไฟล์: src/CareerList.jsx

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./CareerList.css"; // ✅ แก้ชื่อไฟล์ CSS ตรงนี้

// Import Icons (เหมือนเดิม)
import { BarChart, PenTool, Server, Cpu, Database, Briefcase } from "lucide-react";

function CareerList() { // ✅ เปลี่ยนชื่อฟังก์ชันเป็น CareerList
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="home-container">
      <h1 className="hero-title">
        อาชีพที่แนะนำสำหรับคุณ <br />
        <span>จากการวิเคราะห์บุคลิกภาพ ความถนัด และความรู้พื้นฐาน</span>
      </h1>

      <div className="career-list-container">
        {careers.length > 0 ? (
          careers.map((career, index) => (
            <div key={career.id || index} className="career-card" onClick={() => navigate(`/learningpath/${encodeURIComponent(career.title)}`)}>

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
        <button className="back-btn-outline" onClick={() => navigate("/basicknowledge")}>
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
}

export default CareerList; // ✅ เปลี่ยน export เป็น CareerList