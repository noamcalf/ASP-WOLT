#include "RecommendCommand.h"
#include <iostream>

// Constructor
RecommendCommand::RecommendCommand(HistoryManager& manager, int uId, int pId)
    : historyManager(manager), userId(uId), productId(pId) {}

// Execute
void RecommendCommand::execute() {
    // use the historyManager function to print the top-10 recommendation
    vector<int> result = historyManager.getRecommendations(userId, productId);
    for (int a = 0; a < result.size(); a++) {
        std::cout << result[a];
    }
}

// Returns how the command should look in the help menu
std::string RecommendCommand::getSignature() const {
    return "recommend [userid] [productid]";
}