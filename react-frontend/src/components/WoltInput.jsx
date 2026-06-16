import React, { forwardRef, useState } from 'react';

const WoltInput = forwardRef(({ 
    label, 
    type = "text", 
    name, 
    value, 
    onChange, 
    placeholder, 
    isValid, 
    errorMessage, 
    disabled, 
    colClass = "mb-3 text-start w-100" 
}, ref) => {
    
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    const currentType = isPasswordType && showPassword ? "text" : type;

    const getInputClass = () => {
        let baseClass = "form-control px-4 py-3 text-dark wolt-input w-100";
        if (isPasswordType) {
            baseClass += " pe-5"; // Add right padding to make room for the toggle icon
        }
        if (isValid === true) return `${baseClass} wolt-input-valid`;
        if (isValid === false) return `${baseClass} wolt-input-invalid`;
        return baseClass;
    };

    return (
        <div className={colClass} ref={ref}>
            {label && (
                <label className="form-label fw-bold mb-2 small text-uppercase tracking-wider d-block px-1" style={{ color: '#3a3c42', fontSize: '0.8rem' }}>
                    {label}
                </label>
            )}
            <div className="position-relative">
                <input 
                    type={currentType} 
                    name={name}
                    className={getInputClass()}
                    placeholder={placeholder}
                    value={value} 
                    onChange={onChange} 
                    disabled={disabled}
                />
                {isPasswordType && (
                    <button 
                        type="button" 
                        className="bg-transparent border-0 p-1 position-absolute top-50 end-0 translate-middle-y me-3" 
                        onClick={() => setShowPassword(!showPassword)} 
                        style={{ zIndex: 5 }}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                )}
            </div>
            {isValid === false && errorMessage && (
                <div className="text-danger mt-1 ms-1" style={{ fontSize: '0.78rem', fontWeight: '600' }}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
});

export default WoltInput;
