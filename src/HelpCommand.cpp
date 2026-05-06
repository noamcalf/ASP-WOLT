#include "HelpCommand.h"
#include <iostream>

using namespace std;

void HelpCommand::execute() {
    // Print all the commands signatures using the reference vector "allCommands"
    for (const auto &com : allCommands) {
        cout << com->getSignature() << endl;
    }
}

// Returns how the command should look in the help menu
string HelpCommand::getSignature() const {
    return "help";
}