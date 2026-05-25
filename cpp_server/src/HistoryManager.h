#ifndef HISTORY_MANAGER_H
#define HISTORY_MANAGER_H

#include <vector>
#include <unordered_map>  
#include <unordered_set>  
#include "IStorage.h"

using namespace std;

class HistoryManager {
private:
    IStorage& storage;

    // Helper functions (moved to private as they are internal logic)
    unordered_map<int, int> getRelevantUsers(int userId, int productId, const vector<int>& allUsers) const;
    
    unordered_map<int, int> calculateProductScores(
        int productId, 
        const unordered_map<int, int>& relevantUsers, 
        const unordered_set<int>& watchedProducts) const;

    vector<int> sortAndFilterTop10(unordered_map<int, int>& productScores) const;

public:
    HistoryManager(IStorage& storageProvider);

    virtual void addProductToUser(int userId, int productId);
    vector<int> getUserHistory(int userId) const;
    int getSimilarityScore(int userId1, int userId2) const;
    virtual vector<int> getRecommendations(int userId, int productId) const;
    virtual bool checkUserExists(int userId) const;
    virtual bool removeProductFromUser(int userId, int productId);
};

#endif