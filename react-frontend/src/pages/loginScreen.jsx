import React, { useState } from 'react';
// ייבוא פונקציית ה-useAuth מהקונטקסט שלכם (שלב א' של המשימה)
import { useAuth } from '../context/authContext'; 
// ייבוא תמונת הרקע המקומית כדי ש-Webpack/Vite ידעו לארוז אותה בצורה נכונה
import woltBg from '../assets/wolt-bg.jpg';

const LoginScreen = () => {
    // סטייט ולוגיקה פנימית של הטופס (שמורים בדיוק אותו דבר)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth(); // שליפת פונקציית הלוגין מהקונטקסט

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');
        setIsLoading(true);

        // סימולציה אסינכרונית - כאן בשלב הבא נחבר את ה-fetch האמיתי לשרת שלכם!
        setTimeout(() => {
            setIsLoading(false);
            if (username === 'admin' && password === '1234') {
                // הדמיה של קבלת טוקן והזרקתו לקונטקסט הגלובלי
                login('dummy-jwt-token'); 
                alert('Success! Connected to WOLT Infrastructure.');
            } else {
                setError('Error: invalid username or password');
            }
        }, 2000);
    };

    return (
        /* שימוש במשתנה woltBg שייבאנו ישירות בתוך ה-inline style של הדיב הראשי */
        <div className="container-fluid min-vh-100 p-0 m-0 position-relative wolt-custom-bg"
             style={{ backgroundImage: `url(${woltBg})` }}>
            
            {/* שכבת עמימות עדינה (Overlay) כדי שהכרטיס הלבן יבלוט מעל הרקע הבהיר של התמונה */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)', zIndex: 0 }}></div>

            {/* הכרטיס המרכזי של Wolt */}
            <div className="card p-5 bg-white shadow-lg wolt-centered-card" 
                 style={{ 
                     width: '90%', 
                     maxWidth: '460px', 
                     borderRadius: '24px', 
                     border: 'none',
                     zIndex: 1
                 }}>
                
                <h2 className="text-center mb-4 fw-bold" style={{ color: '#202125', fontSize: '2.2rem', letterSpacing: '-0.8px' }}>
                    Let's Login to WOLT!
                </h2>

                {/* הצגת הודעת השגיאה המעוצבת */}
                {error && (
                    <div className="alert alert-danger d-flex align-items-center border-0 p-3 mb-4 wolt-error-alert" role="alert" style={{ borderRadius: '14px', fontSize: '0.9rem' }}>
                        <span className="me-2">⚠️</span>
                        <div className="fw-semibold">{error}</div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="w-100">
                    
                    {/* שדה שם משתמש */}
                    <div className="mb-4 text-start w-100">
                        <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1" style={{ color: '#3a3c42', fontSize: '0.8rem' }}>
                            Username 👤
                        </label>
                        <input 
                            type="text" 
                            className="form-control px-4 py-3 text-dark wolt-input w-100"
                            placeholder="Enter your username"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            disabled={isLoading}
                            required 
                        />
                    </div>

                    {/* שדה סיסמה */}
                    <div className="mb-4 text-start w-100">
                        <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1" style={{ color: '#3a3c42', fontSize: '0.8rem' }}>
                            Password 🔒
                        </label>
                        
                        <div className="d-flex align-items-center justify-content-between w-100 position-relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-control px-4 py-3 text-dark wolt-input"
                                style={{ flex: '1' }} 
                                placeholder="Enter your password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                disabled={isLoading}
                                required 
                            />
                            
                            <div className="d-flex align-items-center ms-2" style={{ whiteSpace: 'nowrap' }}>
                                <button 
                                    type="button"
                                    className="bg-transparent border-0 p-1 d-flex align-items-center justify-content-center wolt-eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ 
                                        cursor: 'pointer',
                                        outline: 'none',
                                        fontSize: '1.25rem'
                                    }}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                                
                                <span className="text-muted ms-1 wolt-dynamic-text" style={{ fontSize: '0.75rem', maxWidth: '110px', display: 'inline-block' }}>
                                    {showPassword ? "Hide password" : "Show password"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* כפתור לוגין */}
                    <button 
                        type="submit" 
                        className="btn py-3 text-white fw-bold w-100 mt-2 d-block wolt-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="d-flex justify-content-center align-items-center gap-2">
                                <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                                <span>Loading... ⏳</span>
                            </div>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>

            {/* קוד ה-CSS - מותאם לפריסה מלאה של התמונה המקומית שלכם */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                
                .wolt-custom-bg {
                    font-family: 'Inter', sans-serif;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-attachment: fixed;
                }

                .wolt-centered-card {
                    position: absolute !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2) !important;
                }

                .wolt-input {
                    width: 100% !important;
                    box-sizing: border-box !important;
                    borderRadius: 14px !important;
                    border: 1.5px solid #e2e8f0 !important;
                    background-color: #ffffff !important;
                    color: #202125 !important; 
                    font-size: 1rem !important;
                    transition: all 0.25s ease-in-out !important;
                }

                .wolt-input:focus {
                    border-color: #009de0 !important;
                    box-shadow: 0 0 0 4px rgba(0, 157, 224, 0.12) !important;
                }

                .wolt-input::placeholder {
                    color: #94a3b8 !important;
                    font-size: 0.95rem;
                }

                .wolt-btn {
                    background-color: #009de0 !important;
                    border-radius: 14px !important;
                    font-size: 1rem !important;
                    border: none !important;
                    transition: all 0.2s ease !important;
                }

                .wolt-btn:hover:not(:disabled) {
                    background-color: #007cb2 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 157, 224, 0.2) !important;
                }

                .wolt-btn:disabled {
                    background-color: #a0dbf5 !important;
                    cursor: not-allowed;
                }

                .wolt-eye-btn:hover {
                    transform: scale(1.1);
                    transition: transform 0.1s ease;
                }

                .wolt-dynamic-text {
                    line-height: 1.1;
                    color: #64748b !important;
                }

                .wolt-error-alert {
                    background-color: #f8d7da !important;
                    color: #721c24 !important;
                    border: 1px solid #f5c6cb !important;
                    animation: alertSlideIn 0.3s ease-out forwards;
                }

                @keyframes alertSlideIn {
                    from { opacity: 0; transform: translate3d(0, -10px, 0); }
                    to { opacity: 1; transform: translate3d(0, 0, 0); }
                }
            `}</style>
        </div>
    );
};

export default LoginScreen;