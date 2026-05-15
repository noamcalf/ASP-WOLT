#pragma once
#include "AddCommand.h"
#include "HistoryManager.h"
#include <vector>

using namespace std;

class PatchCommand : public AddCommand {
    public:
    // Using the "father" class's constructor
    PatchCommand(HistoryManager& manager, int id, const std::vector<int>& prods)
        : AddCommand(manager, id, prods) {}

    string execute() override;
    string getSignature() const override;
};