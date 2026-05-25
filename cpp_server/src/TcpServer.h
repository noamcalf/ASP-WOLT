#pragma once

#include <string>
#include <netinet/in.h>
#include "CommandDispatcher.h"
#include "StringParser.h"

class TcpServer {
private:
    int port;
    // file descreptor of the socket
    int server_fd;
    CommandDispatcher& dispatcher;
    StringParser parser;

public:
    // Constructor
    TcpServer(int port, CommandDispatcher& dispatcher);
    
    // Destructor to ensure the socket is closed
    ~TcpServer();

    // Initializes the socket, binds and starts listening
    void start();

    // The main loop that accepts clients and handles communication
    void run();
};