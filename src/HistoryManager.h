#ifndef HISTORY_MANAGER_H
#define HISTORY_MANAGER_H

#include <vector>
#include "IStorage.h"
using std::vector;

class HistoryManager {
private:
    // Reference to the storage interface (Loose Coupling)
    IStorage& storage;

public:
    // Constructor injects the dependency
    HistoryManager(IStorage& storageProvider);

    void addProductToUser(int userId, int productId);
    vector<int> getUserHistory(int userId) const;
    int getSimilarityScore(int userId1, int userId2) const;
};

#endif