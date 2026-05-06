#pragma once
#include "ICommand.h"
#include "HistoryManager.h"
#include <vector>

using namespace std;

class AddCommand : public ICommand {
private:
    // Access to the logic engine
    HistoryManager& historyManager;
    int userId;
    // Needs vector because the user can add more than on product in one command 
    vector<int> productIds;

public:
    AddCommand(HistoryManager& manager, int uid, const vector<int>& pids);
    // Adds the products to the user's history via HistoryManager.
    void execute() override;

    // Returns how the command should look in the help menu
    string getSignature() const override;
};