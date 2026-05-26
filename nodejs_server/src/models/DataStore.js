/**
 * Global In-Memory Data Store.
 * Implements a Singleton pattern to provide a centralized
 * storage module for the application state.
 */
class DataStore {
    constructor() {
        // Array to capture restaurant entities
        this.restaurants = [];
        
        // Array to capture product entities
        this.products = [];
        
        // Array to capture order entities
        this.orders = [];
        
        // Array to capture user entities
        this.users = [];
    }

    /**
     * Clears all state entities from the arrays.
     * Essential for resetting application state during automated testing (TDD).
     */
    clearAll() {
        this.restaurants = [];
        this.products = [];
        this.orders = [];
        this.users = [];
    }
}

/**
 * Export a single instance of the DataStore.
 * This ensures all modules requiring this file share the exact same state in memory.
 */
module.exports = new DataStore();