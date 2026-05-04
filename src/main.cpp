#include <iostream>
#include <string>
#include "FileStorage.h"
#include "HistoryManager.h"
#include "CommandDispatcher.h"
#include "StringParser.h"


int main() {
    // Initialize the Data Layer
    FileStorage storage("data/history.txt"); 

    // Initialize the Logic Layer
    HistoryManager historyManager(storage);

    // Initialize the Controller (Dispatcher)
    // The dispatcher holds the history manager and initializes all supported commands.
    CommandDispatcher dispatcher(historyManager);

    // Initialize the Parser
    // Responsible for translating raw string input into structured Command objects.
    StringParser parser;

    // This string will keep the user's input.
    std::string inputLine;
    
    // The Main Event Loop will run infinitely, processing commands line by line from standard input,
    // until it is forcefully terminated externally.
    while (std::getline(std::cin, inputLine)) {
        
        // Parse the raw string into a structured command
        Command cmd = parser.parse(inputLine);
        
        // Dispatch the command for execution
        dispatcher.dispatch(cmd);
    }

    return 0;
}