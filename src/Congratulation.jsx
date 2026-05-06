import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Congratulation.css';

const Congratulation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { careerName } = location.state || { careerName: "เส้นทางการเรียนรู้" };

    // สร้างข้อมูลละอองแสง (Particles) 30 ดวงแบบสุ่ม
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            size: `${Math.random() * 8 + 4}px`,
            opacity: Math.random() * 0.4 + 0.2
        }));
    }, []);

    return (
        <div className="congrats-layout">
            {/* เอฟเฟกต์ละอองแสงลอย */}
            <div className="particles-container">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="particle"
                        style={{
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            animationDuration: p.animationDuration,
                            animationDelay: p.animationDelay,
                            '--target-opacity': p.opacity
                        }}
                    ></div>
                ))}
            </div>

            <div className="congrats-wide-card">
                <div className="card-accent-line"></div>

                <div className="card-content-wrapper">
                    <div className="content-main">

                        {/* โลโก้ + ชื่อเว็บ */}
                        <div className="brand-header">
                            <img
                                src="/public/logo.png"
                                alt="CareerCompass Logo"
                                className="brand-logo"
                            />
                            <h1 className="brand-name">CareerCompass</h1>
                        </div>

                        <p className="main-subtitle">
                            ขอแสดงความยินดี คุณได้ผ่านการทดสอบและเรียนรู้องค์ความรู้ทั้งหมดใน
                            <span className="text-highlight"> {careerName} </span>
                            เรียบร้อยแล้ว
                        </p>

                        <div className="action-row">
                            <button className="btn-solid" onClick={() => navigate('/career-list')}>
                                ไปหน้าอาชีพที่เเนะนำ
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                            <button className="btn-ghost" onClick={() => navigate('/home')}>
                                กลับหน้าหลัก
                            </button>
                        </div>
                    </div>

                    {/* ด้านขวา: สถิติและรายละเอียด */}
                    <div className="content-stats">
                        <div className="stat-box">
                            <div className="stat-icon-container">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                </svg>
                            </div>
                            <div className="stat-text">
                                <span className="stat-label">ความคืบหน้า</span>
                                <span className="stat-value">เรียนรู้ครบ 100%</span>
                            </div>
                        </div>

                        <div className="stat-box">
                            <div className="stat-icon-container">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <div className="stat-text">
                                <span className="stat-label">การประเมินผล</span>
                                <span className="stat-value">ผ่านการทดสอบทุกด่าน</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Congratulation;