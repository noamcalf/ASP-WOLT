#ifndef HISTORY_MANAGER_H
#define HISTORY_MANAGER_H

#include <vector>
#include "IStorage.h"

class HistoryManager {
private:
    // Reference to the storage interface (Loose Coupling)
    IStorage& storage;

public:
    // Constructor injects the dependency
    HistoryManager(IStorage& storageProvider);

    void addProductToUser(int userId, int productId);
    std::vector<int> getUserHistory(int userId) const;
};

#endif