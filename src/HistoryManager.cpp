#include "HistoryManager.h"
using std::vector;

// Constructor: Initializes the storage reference
HistoryManager::HistoryManager(IStorage& storageProvider) : storage(storageProvider) {
}

void HistoryManager::addProductToUser(int userId, int productId) {
    // get the user's history: use storageProvider
    vector<int> history = storage.getUserHistory(userId);
    // check if this productId is already in this userid's history
    for (int pid : history) {
        if (productId == pid) return;
    }
    // the product is new, save it
    storage.saveUserProduct(userId, productId);
}

std::vector<int> HistoryManager::getUserHistory(int userId) const {
    // return the vector of the user
    return storage.getUserHistory(userId);
}

int HistoryManager::getSimilarityScore(int userId1, int userId2) const {
    // Implement in WOLT-14
    return -1; 
}