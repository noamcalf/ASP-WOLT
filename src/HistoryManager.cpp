#include "HistoryManager.h"
#include <unordered_set>
#include <algorithm>

using namespace std;

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

vector<int> HistoryManager::getUserHistory(int userId) const {
    // return the vector of the user
    return storage.getUserHistory(userId);
}

int HistoryManager::getSimilarityScore(int userId1, int userId2) const {
    // Get the purchase history vectors for both users
    vector<int> history1 = storage.getUserHistory(userId1);
    vector<int> history2 = storage.getUserHistory(userId2);
    
    // Create a hash set from the first user's history for O(1) lookups
    unordered_set<int> user1Products(history1.begin(), history1.end());
    
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

// Helper function
unordered_map<int, int> HistoryManager::getRelevantUsers(int userId, int productId, const vector<int>& allUsers) const {
    unordered_map<int, int> scores;
    for (int otherId : allUsers) {
        if (otherId == userId) continue;

        auto history = storage.getUserHistory(otherId);
        // If the user is not userId and his product vector contains productId
        if (find(history.begin(), history.end(), productId) != history.end()) {
            // Fill the hash table of his id with the result of the similarity score with userId
            scores[otherId] = getSimilarityScore(userId, otherId);
        }
    }
    return scores;
}

// Helper function
unordered_map<int, int> HistoryManager::calculateProductScores(
    int productId, 
    const unordered_map<int, int>& relevantUsers, 
    const unordered_set<int>& watchedProducts) const {
    
    unordered_map<int, int> productScores;
    // For every pair of other_productid and similarity score
    for (auto const& [otherId, simScore] : relevantUsers) {
        // make sure it's possitive (0 means no simularity)
        if (simScore <= 0) continue;
        // For each product that is not productId and not included in userId vector
        for (int pId : storage.getUserHistory(otherId)) {
            if (pId != productId && watchedProducts.find(pId) == watchedProducts.end()) {
                // Add his sim score to the table in the productId place
                productScores[pId] += simScore;
            }
        }
    }
    return productScores;
}

// Helper function
vector<int> HistoryManager::sortAndFilterTop10(unordered_map<int, int>& productScores) const {
    // Create pairs vector for the keys and values of the productScores
    vector<pair<int, int>> finalRecs(productScores.begin(), productScores.end());

    
    // Primary sort: By recommendation score in descending order.
    // Secondary sort (tie-breaker): By product ID in ascending order.
    sort(finalRecs.begin(), finalRecs.end(), [](const auto& a, const auto& b) {
        if (a.second != b.second) {
            return a.second > b.second; // Higher score first
        }
        return a.first < b.first; // Lower ID first in case of a tie
    });

    // Get the top-10 products by the sorting we did, or less if productScores size is less then 10
    vector<int> result;
    int numToReturn = min(static_cast<int>(finalRecs.size()), 10);
    
    for (int i = 0; i < numToReturn; ++i) {
        result.push_back(finalRecs[i].first);
    }

    return result;
}

vector<int> HistoryManager::getRecommendations(int userId, int productId) const {
    auto allUsers = storage.getAllUserIds();
    if (find(allUsers.begin(), allUsers.end(), userId) == allUsers.end()) return {};

    // Get all the users that has productId in their product vector
    auto relevantUsers = getRelevantUsers(userId, productId, allUsers);
    
    // Set an unordered set for the products userId has in his product vector
    auto history = storage.getUserHistory(userId);
    unordered_set<int> watched(history.begin(), history.end());

    // Calculate simscore for each product on the vectors
    auto productScores = calculateProductScores(productId, relevantUsers, watched);

    // Sort and return top-10 products
    return sortAndFilterTop10(productScores);
}

bool HistoryManager::checkUserExists(int uId) const {
    return storage.userExists(uId);
}

bool HistoryManager::removeProductFromUser(int userId, int productId){
    // get the user's history: use storageProvider
    vector<int> history = storage.getUserHistory(userId);
    bool flag = false;
    // check if this productId is in this userid's history
    for (int pid : history) {
        if (productId == pid) {
            flag = true;
        }
    }
    // productId is not on userId's list
    if (!flag) {return false;};

    storage.deleteProducts(userId, productId);

    // The product deleted
    return true;
}