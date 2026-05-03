#pragma once

// Interface for the Command pattern.
class ICommand {
public:
    virtual ~ICommand() = default;
    
    // Pure virtual method to be implemented by concrete commands.
    virtual void execute() = 0;
};