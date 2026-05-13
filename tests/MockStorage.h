#ifndef MOCK_STORAGE_H
#define MOCK_STORAGE_H

#include <vector>
#include <map>
#include "IStorage.h"

class MockStorage : public IStorage {
public:
     // Fake implementation: just pushes to a temporary map of vectors
    mutable std::map<int, std::vector<int>> mockDataMap;
    
    
    void saveUserProduct(int userId, int productId) override;
    std::vector<int> getUserHistory(int userId) const override;
    std::vector<int> getAllUserIds() const override;
    bool userExists(int userId) const override;
    void deleteProducts(int userId, int productId) override;
};

#endif