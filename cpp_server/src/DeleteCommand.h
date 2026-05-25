#include "ICommand.h"
#include "HistoryManager.h"
#include <vector>

class DeleteCommand : public ICommand {
private:
    // Access to the logic engine
    HistoryManager& historyManager;
    int userId;
   // Needs vector because the user can add more than on product in one command 
    vector<int> productIds;

public:
    // Methodes
    DeleteCommand(HistoryManager& manager, int uid, const vector<int>& pids);
    std::string execute() override;
    std::string getSignature() const override;
};