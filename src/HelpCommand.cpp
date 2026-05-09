#include "HelpCommand.h"
#include <iostream>

using namespace std;

string HelpCommand::execute() {
    // Output string
    string output;
    // Print all the commands signatures using the reference vector "allCommands"
    for (const auto &com : allCommands) {
        output += com->getSignature() + "\n";
    }
    return output;
}

// Returns how the command should look in the help menu
string HelpCommand::getSignature() const {
    return "help";
}