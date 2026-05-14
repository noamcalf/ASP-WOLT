#include "AddCommand.h"
#include <iostream>

using namespace std;

// Represents "POST" command
// Constructor
AddCommand::AddCommand(HistoryManager& manager, int id, const std::vector<int>& prods)
    : historyManager(manager), userId(id), productIds(prods) {}

// Execute
string AddCommand::execute() {
    // Iterate all the products, and add them to the userId
    for (int pId : productIds) {
        historyManager.addProductToUser(userId, pId);
    }
    // Return "201 Created" - as was in ex2
    return "201 Created";
}

// Returns how the command should look in the help menu
string AddCommand::getSignature() const {
    return "POST, arguments: [userid] [productid1] [productid2] ...";
}