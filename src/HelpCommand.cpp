#include "HelpCommand.h"
#include <iostream>

void HelpCommand::execute() {
    // Print all the commands signatures using the reference vector "allCommands"
    for (const auto &com : allCommands) {
        std::cout << com->getSignature() << std::endl;
    }
}

// Returns how the command should look in the help menu
std::string HelpCommand::getSignature() const {
    return "help";
}