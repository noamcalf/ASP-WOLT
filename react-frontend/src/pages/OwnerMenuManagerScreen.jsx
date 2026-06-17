import React from 'react';
import { useParams } from 'react-router-dom';

const OwnerMenuManagerScreen = () => {
    const { id } = useParams();

    return (
        <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
            <div className="container">
                <h1 className="display-4 fw-bold mb-4">Menu Manager</h1>
                <p>Managing menu for restaurant ID: {id}</p>
                {/* Coming soon: Menu list and CreateProductForm */}
            </div>
        </div>
    );
};

export default OwnerMenuManagerScreen;
