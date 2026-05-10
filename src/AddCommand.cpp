#include "AddCommand.h"
#include <iostream>

using namespace std;

// Constructor
AddCommand::AddCommand(HistoryManager& manager, int id, const std::vector<int>& prods)
    : historyManager(manager), userId(id), productIds(prods) {}

// Execute
string AddCommand::execute() {
    // Iterate all the products, and add them to the userId
    for (int pId : productIds) {
        historyManager.addProductToUser(userId, pId);
    }
    // Return an empty - as was in ex1
    return "";
}

// Returns how the command should look in the help menu
string AddCommand::getSignature() const {
    return "add [userid] [productid1] [productid2] ...";
}