import React from 'react';

const MainButton = ({ text, loadingText = "Loading... ⏳", isLoading, type = "submit", onClick, disabled }) => {
    return (
        <button 
            type={type} 
            className="btn py-3 text-white fw-bold w-100 mt-2 d-block wolt-btn"
            onClick={onClick}
            disabled={isLoading || disabled}
        >
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                    <span>{loadingText}</span>
                </div>
            ) : (
                text
            )}
        </button>
    );
};

export default MainButton;
