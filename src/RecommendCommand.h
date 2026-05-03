#pragma once
#include "ICommand.h"
#include "HistoryManager.h"

class RecommendCommand : public ICommand {
private:
    // Access to the logic engine
    HistoryManager& historyManager;
    int userId;
    // The user can get recomendation based on one product
    int productId;

public:
    RecommendCommand(HistoryManager& manager, int uid, int pid);
    void execute() override;
};