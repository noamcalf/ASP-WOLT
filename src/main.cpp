#include <iostream>
#include <string>
#include <stdexcept> 
#include "FileStorage.h"
#include "HistoryManager.h"
#include "CommandDispatcher.h"
#include "StringParser.h"
#include "TcpServer.h"

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

    // Initialize and Start the Server
    TcpServer server(port, dispatcher);
    server.start();
    server.run(); 

    return 0;
}