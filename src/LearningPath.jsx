import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import './LearningPath.css';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:4546'}/api`;

// Returns Authorization header if user is logged in
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const LearningPath = () => {
    const navigate = useNavigate();
    const { careerSlug } = useParams(); // รับ slug จาก URL เช่น /learningpath/data-scientist
    const [learningPath, setLearningPath] = useState(null);
    const [selectedStage, setSelectedStage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noPathSelected, setNoPathSelected] = useState(false);
    const [updatingProgress, setUpdatingProgress] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);

    // Get user info from localStorage
    const userId = localStorage.getItem('user_id') || null;
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userIdFromToken = parsedUser?.id || userId;

    useEffect(() => {
        const storageKey = userIdFromToken ? `activeCareerSlug_${userIdFromToken}` : 'activeCareerSlug_guest';

        if (!careerSlug) {
            const savedSlug = localStorage.getItem(storageKey);
            if (savedSlug) {
                navigate(`/learningpath/${encodeURIComponent(savedSlug)}`, { replace: true });
            } else {
                setNoPathSelected(true);
                setLoading(false);
            }
        } else {
            setNoPathSelected(false);
            localStorage.setItem(storageKey, careerSlug);
            fetchLearningPath();
        }
    }, [careerSlug, navigate, userIdFromToken]);

    const fetchLearningPath = async () => {
        try {
            setLoading(true);
            setError(null);

            // ใช้ careerSlug จาก URL params — decode เผื่อมี space
            const slug = decodeURIComponent(careerSlug || 'Data Scientist');
            const url = userIdFromToken
                ? `${API_BASE}/learning-path/${encodeURIComponent(slug)}?user_id=${userIdFromToken}`
                : `${API_BASE}/learning-path/${encodeURIComponent(slug)}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setLearningPath(data);
            // Auto-select first in-progress or first stage
            const firstActive = data.stages?.find(s => s.status === 'in-progress') || data.stages?.[0];
            if (firstActive) setSelectedStage(firstActive);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProgress = async (stageId, newStatus) => {
        if (!userIdFromToken) return;
        try {
            setUpdatingProgress(true);
            const res = await fetch(`${API_BASE}/learning-path/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify({
                    user_id: userIdFromToken,
                    stage_id: stageId,
                    status: newStatus,
                }),
            });
            if (!res.ok) throw new Error('Failed to update progress');

            // Construct URL to fetch updated the data
            const slug = decodeURIComponent(careerSlug || 'Data Scientist');
            const url = userIdFromToken
                ? `${API_BASE}/learning-path/${encodeURIComponent(slug)}?user_id=${userIdFromToken}`
                : `${API_BASE}/learning-path/${encodeURIComponent(slug)}`;

            const updatedRes = await fetch(url);
            if (updatedRes.ok) {
                const newData = await updatedRes.json();
                setLearningPath(newData);
                if (newData.completed_stages === newData.total_stages && newData.total_stages > 0) {
                    navigate('/congratulation', { state: { careerName: newData.career_name, careerSlug } });
                    return;
                }
            }
            await fetchLearningPath();
        } catch (err) {
            alert('ไม่สามารถอัปเดต progress ได้: ' + err.message);
        } finally {
            setUpdatingProgress(false);
        }
    };

    const getProgressPercent = () => {
        if (!learningPath) return 0;
        return Math.round((learningPath.completed_stages / learningPath.total_stages) * 100);
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed': return 'Completed ✓';
            case 'in-progress': return 'In Progress';
            default: return 'Locked';
        }
    };

    const handleCancelPath = async () => {
        if (!userIdFromToken) {
            navigate('/home');
            return;
        }
        try {
            const slug = decodeURIComponent(careerSlug || 'Data Scientist');
            await fetch(`${API_BASE}/learning-path/${encodeURIComponent(slug)}/reset?user_id=${userIdFromToken}`, {
                method: 'DELETE',
                headers: { ...getAuthHeader() },
            });
            navigate('/home');
        } catch (err) {
            console.error('Failed to reset path', err);
            navigate('/home');
        }
    };

    const navigateToQuiz = () => {
        navigate(
            `/quiz/${encodeURIComponent(careerSlug || 'general')}/${selectedStage.id}`,
            {
                state: {
                    careerName: learningPath.career_name,
                    stageName: selectedStage.title,
                    stageSubtitle: selectedStage.subtitle,
                    stageId: selectedStage.id,
                    careerSlug: careerSlug,
                    courses: selectedStage.courses ? selectedStage.courses.map(c => c.title) : [],
                    isLastStage: learningPath.stages[learningPath.stages.length - 1].id === selectedStage.id,
                    totalStages: learningPath.total_stages,
                },
            }
        );
    };

    const handleQuizClick = () => {
        if (selectedStage.status === 'completed') {
            setShowRetakeConfirm(true);
        } else {
            navigateToQuiz();
        }
    };

    if (noPathSelected) {
        return (
            <div className="learning-path-container">
                <div className="lp-error" style={{ padding: '60px 20px' }}>
                    <div className="lp-error-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>🧭</div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: '#143D60' }}>คุณยังไม่ได้เริ่มเส้นทางอาชีพ</h2>
                    <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
                        ทำแบบทดสอบเพื่อค้นหาอาชีพที่ใช่ และรับ Learning Path ของคุณ
                    </p>
                    <button
                        onClick={() => navigate('/home')}
                        style={{
                            background: '#ff5a00', color: 'white', border: 'none',
                            padding: '12px 32px', borderRadius: '25px',
                            fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer'
                        }}
                    >
                        ไปทำแบบทดสอบกันเลย
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="learning-path-container">
                <div className="lp-loading">
                    <div className="lp-spinner"></div>
                    <p>กำลังโหลดเส้นทางการเรียนรู้...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="learning-path-container">
                <div className="lp-error">
                    <div className="lp-error-icon">⚠️</div>
                    <h2>ไม่สามารถโหลดข้อมูลได้</h2>
                    <p>{error}</p>
                    <button className="lp-retry-btn" onClick={fetchLearningPath}>ลองใหม่</button>
                </div>
            </div>
        );
    }

    if (!learningPath) return null;

    return (
        <div className="learning-path-container">
            {/* Header */}
            <header className="learning-path-header">
                <h1 className="learning-path-title">{learningPath.career_name} Learning Path</h1>
                <p className="learning-path-desc">{learningPath.description}</p>
            </header>

            <div className="learning-path-content">
                {/* Progress Stats */}
                <div className="progress-stats">
                    <h2 className="progress-title">ความคืบหน้าโดยรวม</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-number">{learningPath.total_stages}</span>
                            <span className="stat-label">ด่านทั้งหมด</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{learningPath.completed_stages}</span>
                            <span className="stat-label">ด่านที่เสร็จสิ้น</span>
                        </div>
                    </div>
                    <div className="progress-bar-container">
                        <div className="progress-label">
                            <span>ความสำเร็จทั้งหมด</span>
                            <span>{getProgressPercent()}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${getProgressPercent()}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Path Visual + Courses */}
                <div className="lp-main-layout">
                    {/* Path Visual */}
                    <div className="path-visual">
                        <div className="stages-container">
                            {learningPath.stages.map((stage) => (
                                <div
                                    key={stage.id}
                                    className="stage-wrapper"
                                    style={{
                                        top: stage.position_top || undefined,
                                        left: stage.position_left || undefined,
                                        right: stage.position_right || undefined,
                                        bottom: stage.position_bottom || undefined,
                                        transform: stage.position_transform || undefined,
                                    }}
                                    onClick={() => setSelectedStage(stage)}
                                >
                                    <div className={`stage-node ${stage.status === 'in-progress' ? 'active' : stage.status === 'completed' ? 'done' : 'locked'} ${selectedStage?.id === stage.id ? 'selected' : ''}`}>
                                        <div className="stage-content">
                                            <h3 className="stage-title">{stage.title}</h3>
                                            <p className="stage-subtitle">{stage.subtitle}</p>
                                            <button className={`stage-button ${stage.status}`}>
                                                {getStatusLabel(stage.status)}
                                            </button>
                                        </div>
                                        {stage.status === 'locked' && (
                                            <div className="lock-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        {stage.status === 'completed' && (
                                            <div className="done-icon">✓</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Courses for selected stage */}
                    {selectedStage && (
                        <div className="courses-section">
                            <div className="courses-header">
                                <div>
                                    <h2 className="courses-title">{selectedStage.title}</h2>
                                    <p className="courses-subtitle">{selectedStage.subtitle}</p>
                                </div>
                                <div className="courses-header-actions">
                                    <span className={`courses-status-badge ${selectedStage.status}`}>
                                        {getStatusLabel(selectedStage.status)}
                                    </span>
                                    <button
                                        className={`quiz-nav-button ${selectedStage.status === 'locked' ? 'course-button-disabled' : ''}`}
                                        disabled={selectedStage.status === 'locked'}
                                        onClick={handleQuizClick}
                                    >
                                        ทำแบบทดสอบ
                                    </button>
                                </div>
                            </div>

                            {/* Progress actions (only if user logged in) */}
                            {userId && (
                                <div className="progress-actions">
                                    {selectedStage.status === 'locked' && (
                                        <button
                                            className="action-btn start-btn"
                                            disabled={updatingProgress}
                                            onClick={() => handleUpdateProgress(selectedStage.id, 'in-progress')}
                                        >
                                            🚀 เริ่มเรียน
                                        </button>
                                    )}
                                    {selectedStage.status === 'in-progress' && (
                                        <button
                                            className="action-btn complete-btn"
                                            disabled={updatingProgress}
                                            onClick={() => handleUpdateProgress(selectedStage.id, 'completed')}
                                        >
                                            ✅ ทำเครื่องหมายว่าเสร็จแล้ว
                                        </button>
                                    )}
                                    {selectedStage.status === 'completed' && (
                                        <div className="completed-badge">🎉 เสร็จสิ้นแล้ว!</div>
                                    )}
                                </div>
                            )}

                            <div className="courses-grid">
                                {selectedStage.courses && selectedStage.courses.length > 0 ? (
                                    selectedStage.courses.map((course) => (
                                        <div key={course.id} className="course-card">
                                            <div className="course-content">
                                                <h3 className="course-title">{course.title}</h3>
                                                <p className="course-subtitle">{course.subtitle}</p>
                                                {course.url ? (
                                                    <a
                                                        href={course.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="course-button"
                                                    >
                                                        เริ่มลงเรียน
                                                    </a>
                                                ) : (
                                                    <button className="course-button course-button-disabled" disabled>
                                                        Coming Soon
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-courses">
                                        <p>ยังไม่มีคอร์สในด่านนี้</p>
                                    </div>
                                )}
                            </div>

                            <div className="courses-footer">
                                <button
                                    className="cancel-path-button"
                                    onClick={() => setShowCancelConfirm(true)}
                                >
                                    ยกเลิกเส้นทาง
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Learning Path Confirmation Modal */}
            <AnimatePresence>
                {showCancelConfirm && (
                    <div className="lp-modal-overlay">
                        <motion.div
                            className="lp-modal-card"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <button className="lp-modal-close" onClick={() => setShowCancelConfirm(false)}>
                                <X size={20} />
                            </button>

                            <div className="lp-modal-icon-container">
                                <div className="lp-modal-icon-bg">
                                    <AlertTriangle className="lp-modal-icon" size={32} />
                                </div>
                            </div>

                            <div className="lp-modal-content">
                                <h2 className="lp-modal-title">ยืนยันการยกเลิก</h2>
                                <p className="lp-modal-message">
                                    คุณแน่ใจหรือไม่ว่าต้องการยกเลิกเส้นทางการเรียนรู้นี้?
                                    ความคืบหน้าของคุณจะยังคงอยู่ แต่คุณจะกลับไปยังหน้าหลัก
                                </p>
                            </div>

                            <div className="lp-modal-actions">
                                <button
                                    className="lp-modal-btn-secondary"
                                    onClick={() => setShowCancelConfirm(false)}
                                >
                                    กลับไปเรียนต่อ
                                </button>
                                <button
                                    className="lp-modal-btn-danger"
                                    onClick={handleCancelPath}
                                >
                                    ใช่, ยกเลิกเลย
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showRetakeConfirm && (
                    <div className="lp-modal-overlay">
                        <motion.div
                            className="lp-modal-card"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <button className="lp-modal-close" onClick={() => setShowRetakeConfirm(false)}>
                                <X size={20} />
                            </button>

                            <div className="lp-modal-icon-container">
                                <div className="lp-modal-icon-bg">
                                    <AlertTriangle className="lp-modal-icon" size={32} />
                                </div>
                            </div>

                            <div className="lp-modal-content">
                                <h2 className="lp-modal-title">ทำแบบทดสอบอีกครั้ง?</h2>
                                <p className="lp-modal-message">
                                    คุณได้ผ่านด่านนี้ไปแล้ว คุณต้องการที่จะทำแบบทดสอบเพื่อทบทวนความรู้อีกครั้งหรือไม่?
                                </p>
                            </div>

                            <div className="lp-modal-actions">
                                <button
                                    className="lp-modal-btn-secondary"
                                    onClick={() => setShowRetakeConfirm(false)}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    className="lp-modal-btn-danger"
                                    onClick={() => {
                                        setShowRetakeConfirm(false);
                                        navigateToQuiz();
                                    }}
                                >
                                    ใช่, ทำแบบทดสอบ
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LearningPath;