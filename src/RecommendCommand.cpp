#include "RecommendCommand.h"

// Constructor
RecommendCommand::RecommendCommand(HistoryManager& manager, int uId, int pId)
    : historyManager(manager), userId(uId), productId(pId) {}

// Execute
void RecommendCommand::execute() {
    // TODO: Fetch recommendations and print them separated by space.
    // Remember to handle the empty list case
}

// Returns how the command should look in the help menu
std::string RecommendCommand::getSignature() const {
    // implement 
}