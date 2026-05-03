#include "AddCommand.h"
#include <iostream>

// Constructor
AddCommand::AddCommand(HistoryManager& manager, int id, const std::vector<int>& prods)
    : historyManager(manager), userId(id), productIds(prods) {}

// Execute
void AddCommand::execute() {
    // Iterate all the products, and add them to the userId
    for (int pId : productIds) {
        historyManager.addProductToUser(userId, pId);
    }
}

// Returns how the command should look in the help menu
std::string AddCommand::getSignature() const {
    return "add [userid] [productid1] [productid2] ...";
}