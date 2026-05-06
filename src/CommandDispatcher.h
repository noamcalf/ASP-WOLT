#pragma once

#include "ICommand.h"
#include "Command.h" // Contains the CommandType enum and Command struct
#include "HistoryManager.h"
#include <memory>

using namespace std;

class CommandDispatcher {
private:
    // Reference to the main logic engine to be passed to the commands
    HistoryManager& historyManager;
    // List of objects that will use us to print the command signature for "help" command
    vector<shared_ptr<ICommand>> commandPrototypes;

public:
    // Constructor injecting the HistoryManager dependency
    explicit CommandDispatcher(HistoryManager& manager);

    // Translates the raw command to an ICommand object and executes it
    void dispatch(const Command& rawCommand);
};