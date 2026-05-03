#pragma once
#include "ICommand.h"
#include <string>

class HelpCommand : public ICommand {
public:
// No need constractor, only prints to the screen
    void execute() override;
    std::string getSignature() const override;
};