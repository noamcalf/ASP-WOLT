#include "TcpServer.h"
#include <sys/socket.h>
#include <unistd.h>
#include <cstdlib>

using namespace std;

// Constructor setup
TcpServer::TcpServer(int p, CommandDispatcher& d) : port(p), dispatcher(d), server_fd(-1) {}

// Ensure the socket is closed when the object is destroyed
TcpServer::~TcpServer() {
    if (server_fd != -1) {
        close(server_fd);
    }
}

// Setup the server socket
void TcpServer::start() {
    struct sockaddr_in address;
    int opt = 1;

    // Create an IPv4 TCP socket
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        exit(1); 
    }

    // Allow immediate reuse of the port
    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt))) {
        exit(1);
    }

    // Setup the address structure
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY; // Accept connections from any network interface
    address.sin_port = htons(port);       // 'htons' converts port to Network Byte Order (Big Endian)

    // Bind the socket to the specified port
    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        exit(1);
    }

    // Listen for incoming connections with a backlog queue of 3
    if (listen(server_fd, 3) < 0) {
        exit(1);
    }
}

// Main execution loop for client handling
void TcpServer::run() {
    struct sockaddr_in address;
    int addrlen = sizeof(address);
    int client_socket;

    // Block and wait for a new client to connect
    client_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen);
    
    // Exit silently if accepting fails
    if (client_socket < 0) {
        exit(1);
    }

    // Temporary close until WOLT-73 read/write loop implementation
    close(client_socket); 
}