#include "HistoryManager.h"
#include <unordered_set>
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
    // Get the purchase history vectors for both users
    vector<int> history1 = storage.getUserHistory(userId1);
    vector<int> history2 = storage.getUserHistory(userId2);
    
    // Create a hash set from the first user's history for O(1) lookups
    std::unordered_set<int> user1Products(history1.begin(), history1.end());
    
    // Initialize a counter for similar products
    int similarProductsCount = 0;
    
    // Iterate over the second user's history
    for (int productId : history2) {
        // If the product exists in user1's set, increment the counter
        if (user1Products.count(productId) > 0) {
            similarProductsCount++;
        }
    }
    // Return the final similarity score
    return similarProductsCount;
}