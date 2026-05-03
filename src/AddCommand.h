#pragma once
#include "ICommand.h"
#include "HistoryManager.h"
#include <vector>

class AddCommand : public ICommand {
private:
    // Access to the logic engine
    HistoryManager& historyManager;
    int userId;
    // Needs vector because the user can add more than on product in one command 
    std::vector<int> productIds;

public:
    AddCommand(HistoryManager& manager, int uid, const std::vector<int>& pids);
    // Adds the products to the user's history via HistoryManager.
    void execute() override;

    // Returns how the command should look in the help menu
    std::string getSignature() const override;
};