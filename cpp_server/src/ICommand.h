#pragma once
#include <string>

// Interface for the Command pattern.
class ICommand {
public:
    virtual ~ICommand() = default;
    
    // Pure virtual method to be implemented by concrete commands.
    virtual std::string execute() = 0;
    // returns how the command should look in the help menu
    virtual std::string getSignature() const = 0;
};