import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import CreateMenuItemForm from '../components/CreateMenuItemForm';
import MenuItemRow from '../components/MenuItemRow';
import DeleteButton from '../components/DeleteButton';

const OwnerMenuManagerScreen = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();
    
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch restaurant details
            const { response: restRes, data: restData } = await apiClient(`/api/restaurants/${restaurantId}`);
            if (!restRes.ok) throw new Error(restData?.error || 'Failed to fetch restaurant');
            setRestaurant(restData);

            // Fetch menu items
            const { response: itemsRes, data: itemsData } = await apiClient(`/api/restaurants/${restaurantId}/products`);
            if (!itemsRes.ok) throw new Error(itemsData?.error || 'Failed to fetch menu items');
            setMenuItems(itemsData);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (restaurantId) {
            fetchData();
        }
    }, [restaurantId]);

    const handleItemCreated = () => {
        setShowCreateForm(false);
        fetchData(); // Refresh the items list
    };

    if (isLoading && !restaurant) {
        return (
            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (error && !restaurant) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-danger d-inline-block rounded-4 shadow-sm">
                    <span className="fw-bold">⚠️ Error:</span> {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100 py-5" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                
                {/* Navigation Breadcrumb - Consistent Floating Back Button Style */}
                <div className="mb-4">
                    <button 
                        onClick={() => navigate('/owner/dashboard')} 
                        className="rounded-circle shadow-sm d-flex justify-content-center align-items-center bg-body" 
                        style={{ width: '45px', height: '45px', border: 'none', transition: 'all 0.2s ease' }}
                    >
                        <span className="fs-4 wolt-text-heading">←</span>
                    </button>
                </div>

                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-5">
                    <div>
                        <h1 className="display-5 fw-bold wolt-text-heading mb-1">{restaurant?.name} - Menu</h1>
                        <p className="text-muted fs-5">Manage your dishes and catalog items</p>
                    </div>
                    <div className="d-flex flex-column gap-2 align-items-end" style={{ minWidth: '180px' }}>
                        <DeleteButton 
                            endpoint={`/api/restaurants/${restaurantId}`}
                            confirmationMessage="Are you absolutely sure you want to delete this ENTIRE restaurant? This action cannot be undone!"
                            onSuccess={() => window.location.href = '/owner/dashboard'}
                            className="btn-outline-danger w-100 px-4 py-2 rounded-pill"
                        >
                            Delete Restaurant
                        </DeleteButton>
                        <button 
                            className="wolt-btn text-white w-100 px-4 py-2"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            {showCreateForm ? 'Cancel' : '+ Add Menu Item'}
                        </button>
                    </div>
                </div>

                {/* Create Form Section */}
                {showCreateForm && (
                    <div className="card border-0 shadow-sm rounded-4 mb-5 p-4 bg-body">
                        <h4 className="fw-bold mb-4">Create New Item</h4>
                        <CreateMenuItemForm restaurantId={restaurantId} onSuccess={handleItemCreated} />
                    </div>
                )}

                {/* Menu Items List */}
                <h4 className="fw-bold mb-4">Current Menu</h4>
                
                {isLoading && menuItems.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : menuItems.length === 0 ? (
                    <div className="text-center wolt-text-muted p-5 bg-body rounded-4 shadow-sm border" style={{ borderColor: 'var(--bs-border-color-translucent)' }}>
                        <span style={{ fontSize: '3rem' }}>🍔</span>
                        <h5 className="mt-3 wolt-text-heading">Your menu is empty.</h5>
                        <p>Click the button above to add your first dish!</p>
                    </div>
                ) : (
                    <div className="row">
                        {menuItems.map(item => (
                            <div key={item.id} className="col-12 col-lg-6 px-3">
                                <MenuItemRow 
                                    product={item} 
                                    ownerMode={true} 
                                    deleteEndpoint={`/api/restaurants/${restaurantId}/products/${item.id}`}
                                    onDeleteSuccess={fetchData} 
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerMenuManagerScreen;
