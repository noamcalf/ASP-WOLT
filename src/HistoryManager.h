#ifndef HISTORY_MANAGER_H
#define HISTORY_MANAGER_H

#include <vector>
#include <unordered_map>  
#include <unordered_set>  
#include "IStorage.h"

using std::vector;

class HistoryManager {
private:
    IStorage& storage;

    // Helper functions (moved to private as they are internal logic)
    std::unordered_map<int, int> getRelevantUsers(int userId, int productId, const std::vector<int>& allUsers) const;
    
    std::unordered_map<int, int> calculateProductScores(
        int productId, 
        const std::unordered_map<int, int>& relevantUsers, 
        const std::unordered_set<int>& watchedProducts) const;

    std::vector<int> sortAndFilterTop10(std::unordered_map<int, int>& productScores) const;

public:
    HistoryManager(IStorage& storageProvider);

    virtual void addProductToUser(int userId, int productId);
    vector<int> getUserHistory(int userId) const;
    int getSimilarityScore(int userId1, int userId2) const;
    virtual vector<int> getRecommendations(int userId, int productId) const;
};

#endif