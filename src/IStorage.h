#ifndef ISTORAGE_H
#define ISTORAGE_H

#include <vector>

// Interface for data persistence (Dependency Inversion Principle)
class IStorage {
public:
    virtual ~IStorage() = default;
    
    // Virtual functions to be implemented by concrete storage classes
    
    // Saves a specific product ID to a user's history
    virtual void saveUserProduct(int userId, int productId) = 0;
    
    // Retrieves a list of all product IDs associated with a specific user
    virtual std::vector<int> getUserHistory(int userId) const = 0;
    
    // Retrieves a list of all unique user IDs currently stored in the system
    virtual std::vector<int> getAllUserIds() const = 0;
    
    // Checks if a specific user ID has any existing records in the storage
    virtual bool userExists(int userId) const = 0;
    
    // Removes all instances of a specific product ID for a given user
    virtual void deleteProducts(int userId, int productId) = 0;
};

#endif