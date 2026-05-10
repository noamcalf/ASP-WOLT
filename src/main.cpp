#include <iostream>
#include <string>
#include <stdexcept> 
#include "FileStorage.h"
#include "HistoryManager.h"
#include "CommandDispatcher.h"
#include "StringParser.h"

using namespace std;

int main(int argc, char* argv[])  {
    
    // Check if the port argument was provided
    if (argc < 2) {
        return 1; // Exit silently without printing
    }

    int port;
    try {
        port = stoi(argv[1]);
    } catch (...) {
        // Exit silently if the argument is not a valid integer
        return 1;
    }
    
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
    string inputLine;
    
    // The Main Event Loop will run infinitely, processing commands line by line from standard input,
    // until it is forcefully terminated externally.
    while (getline(cin, inputLine)) {
        
        // Parse the raw string into a structured command
        Command cmd = parser.parse(inputLine);
        
        /// Dispatch the command for execution and get the string result
        string result = dispatcher.dispatch(cmd);
        
        // Print the result if it's not empty
        if (!result.empty()) {
            cout << result;
        }
    }

    return 0;
}