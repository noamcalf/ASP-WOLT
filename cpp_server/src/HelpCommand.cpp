#include "HelpCommand.h"
#include <iostream>
#include <algorithm>

using namespace std;

string HelpCommand::execute() {
    // Output string vector
    vector<string> comVector;
    // Add all signatures to the vector
    for (const auto& com : allCommands) {
        // Help will be the lasr command to get printed
        if (!(com->getSignature().compare("help"))) {continue;}
        comVector.push_back(com->getSignature());
    }

    // Sort the vector as mentioned in ex2
    sort(comVector.begin(), comVector.end());

    // Create the final string
    string output = "";

    // Build the string 
    for (const auto& c : comVector) {
        output += c + "\n";
    }

    // Add "help"
    output += getSignature() + "\n";

    return output;
}

// Returns how the command should look in the help menu
string HelpCommand::getSignature() const {
    return "help";
}