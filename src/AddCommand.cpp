#include "AddCommand.h"

// Constructor
AddCommand::AddCommand(HistoryManager& manager, int id, const std::vector<int>& prods)
    : historyManager(manager), userId(id), productIds(prods) {}

// Execute
void AddCommand::execute() {
    // TODO: Iterate over productIds and call historyManager.addProductToUser
}