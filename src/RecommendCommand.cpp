#include "RecommendCommand.h"
#include <iostream>
#include <algorithm>

using namespace std;

// Constructor
RecommendCommand::RecommendCommand(HistoryManager& manager, int uId, int pId)
    : historyManager(manager), userId(uId), productId(pId) {}

// Execute
string RecommendCommand::execute() {
    // Get the vector of product IDs from historyManager
    vector<int> recs = historyManager.getRecommendations(userId, productId);

    // Build the string from the vector, starting with the HTTP status
    string output = "200 Ok\n\n";
    
    for (size_t i = 0; i < recs.size(); ++i) {
        output += std::to_string(recs[i]);
        // Add a space between IDs, but not after the last one
        if (i < recs.size() - 1) {
            output += " ";
        }
    }
    // Add final newline as per protocol requirements
    return output + '\n';
}

// Returns how the command should look in the help menu
string RecommendCommand::getSignature() const {
    return "GET, arguments: [userid] [productid]";
}