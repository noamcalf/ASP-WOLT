#pragma once
#include <memory>
#include <vector>
#include "ICommand.h"

class HelpCommand : public ICommand {
private:
    // Pointers vector to all command types
    const std::vector<std::shared_ptr<ICommand>>& allCommands;

public:

    HelpCommand(const std::vector<std::shared_ptr<ICommand>>& commands) 
        : allCommands(commands) {}
    void execute() override;
    std::string getSignature() const override;
};