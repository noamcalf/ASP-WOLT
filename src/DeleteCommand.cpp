#include "DeleteCommand.h"
#include <iostream>
#include <algorithm>

using namespace std;

// Constructor
DeleteCommand::DeleteCommand(HistoryManager& manager, int uId, const std::vector<int>& prods)
    : historyManager(manager), userId(uId), productIds(prods) {}

// Execute
string DeleteCommand::execute() {
    // Iterate all the products, and delete them to the userId
    // If one of the remove methods fails - the DeleteCommand has logic failure
    for (int pId : productIds) {
        if (historyManager.removeProductFromUser(userId, pId) == false) {
            return "404 Not Found";
        }
    }
    return "204 No Content";
}

// Returns how the command should look in the help menu
string DeleteCommand::getSignature() const {
    return "DELETE, arguments: [userid] [productid1] [productid2] ...";
}
