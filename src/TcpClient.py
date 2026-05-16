import socket
import sys

def main():
    # Make sure we got the user's ip and port as arguments
    if len(sys.argv) < 3:
        sys.exit(1)

    # Get the srever's id and port
    server_ip = sys.argv[1]   
    # Port must be an int 
    try:
        server_port = int(sys.argv[2])
    except ValueError:
        sys.exit(1)
    
    # declare the socket's variable
    client_socket = None    

    try:
        # Create the TCP socket 
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        # Connect ther server's details as a tuple to the socket
        client_socket.connect((server_ip, server_port))

        # endless loop to get user input
        while True:
            user_input = input("> ")

            # Send the message to the server
            client_socket.sendall(user_input.encode())

            # Get the server's response
            response = client_socket.recv(4096)
            
            # Make sure we got a response
            if not response:
                break

            # Print the server's response
            print(response.decode())

    # Catch the exeption, and do nothing
    except Exception as e:
        pass

    finally:
            # Close the socket in the end of the connection
            if client_socket is not None:
                client_socket.close()

if __name__ == "__main__":
    main()