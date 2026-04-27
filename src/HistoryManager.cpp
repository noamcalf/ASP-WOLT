#include "HistoryManager.h"

// Constructor: Initializes the storage reference
HistoryManager::HistoryManager(IStorage& storageProvider) : storage(storageProvider) {
}

void HistoryManager::addProductToUser(int userId, int productId) {
    // Task WOLT-12: We will implement this later to call storage.saveUserProduct()
}

std::vector<int> HistoryManager::getUserHistory(int userId) const {
    // Task WOLT-12: We will implement this later to call storage.getUserHistory()
    
    // Returning an empty vector intentionally to make the test fail!
    return std::vector<int>();
}