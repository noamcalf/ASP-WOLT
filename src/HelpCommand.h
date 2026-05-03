#pragma once
#include "ICommand.h"

class HelpCommand : public ICommand {
public:
// No need constractor, only prints to the screen
    void execute() override;
};