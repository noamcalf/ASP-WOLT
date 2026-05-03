#include "RecommendCommand.h"
#include <iostream>
#include <algorithm>

// Constructor
RecommendCommand::RecommendCommand(HistoryManager& manager, int uId, int pId)
    : historyManager(manager), userId(uId), productId(pId) {}

// Execute
void RecommendCommand::execute() {
    // use the historyManager function to print the top-10 recommendation
    vector<int> result = historyManager.getRecommendations(userId, productId);
    // No more then 10 recommendations
    size_t limit = std::min(result.size(), static_cast<size_t>(10));
    for (int i = 0; i < limit; ++i) {
        std::cout << result[i];
        // Add whitespace only if it is not the last char
        if (i < static_cast<int>(limit) - 1) {
            std::cout << " ";
        }   
    }
    std::cout << std::endl;
}

// Returns how the command should look in the help menu
std::string RecommendCommand::getSignature() const {
    return "recommend [userid] [productid]";
}