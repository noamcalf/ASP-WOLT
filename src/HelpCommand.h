#pragma once
#include <memory>
#include <vector>
#include "ICommand.h"

using namespace std;

class HelpCommand : public ICommand {
private:
    // Pointers vector to all command types
    const vector<shared_ptr<ICommand>>& allCommands;

public:

    HelpCommand(const vector<shared_ptr<ICommand>>& commands) 
        : allCommands(commands) {}
    void execute() override;
    string getSignature() const override;
};