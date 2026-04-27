#ifndef ISTORAGE_H
#define ISTORAGE_H

#include <vector>

// Interface for data persistence (Dependency Inversion Principle)
class IStorage {
public:
    virtual ~IStorage() = default;
    
    // Virtual functions to be implemented by concrete storage classes
    virtual void saveUserProduct(int userId, int productId) = 0;
    virtual std::vector<int> getUserHistory(int userId) const = 0;
};

#endif