#include "RecommendCommand.h"
#include <iostream>
#include <algorithm>

using namespace std;

// Constructor
RecommendCommand::RecommendCommand(HistoryManager& manager, int uId, int pId)
    : historyManager(manager), userId(uId), productId(pId) {}

// Execute
string RecommendCommand::execute() {
    // use the historyManager function to print the top-10 recommendation
    vector<int> result = historyManager.getRecommendations(userId, productId);
    // No more then 10 recommendations
    size_t limit = min(result.size(), static_cast<size_t>(10));
    for (int i = 0; i < limit; ++i) {
        cout << result[i];
        // Add whitespace only if it is not the last char
        if (i < static_cast<int>(limit) - 1) {
            cout << " ";
        }   
    }
    cout << endl;
}

// Returns how the command should look in the help menu
string RecommendCommand::getSignature() const {
    return "recommend [userid] [productid]";
}