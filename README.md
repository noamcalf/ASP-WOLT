ASP-WOLT: Product Recommendation System
Overview:
ASP-WOLT is a C++ based Command Line Interface (CLI) application designed to provide personalized product recommendations for users based on their purchase history. The system calculates user similarity using advanced scoring algorithms and persists data to ensure history is maintained between sessions.

The project was developed as part of the academic curriculum at Bar-Ilan University.

Prerequisites:
1.Docker Desktop
2.Git

Note: The application environment is standardized via Docker. The Dockerfile is configured to use Bash as the primary shell. All execution paths and scripts are designed for a Bash-compliant environment to ensure consistency across different host systems.

Installation & Build:
1.Clone the repository: [use command: git clone https://github.com/noamcalf/ASP-WOLT]
2.Enter the repository: [use command: cd ASP-WOLT]
3.Build docker image: [use command: docker build -t wolt-app-image .]
4.Run the container: [use command: docker run -it --name wolt-container -v "$(pwd):/app" wolt-app-image]
5.Create and enter "build" repository: [use command: mkdir build && cd build]
6.Run Cmake: [use command: cmake ..]
7.Compile with make: [use command: make]
8.Run the app: [use command: ./wolt_app]

![Installation & Build - 1](./images/loading1.png)
![Installation & Build - 2](./images/loading2.png)


Usage & Execution Example:
1.ADD:
Use the add command to register at least one product for a specific user.
# Syntax: add <userId> <productId1> <productId2> <productId3> ...
> add 101 50 60 70
> add 101 55 50
> add 202 50

No expected output.

![Add Command Example](./images/add_example.png)

2.RECOMMEND:
Use the recommend command to find products a user might like based on users that also add the specific product the function gets as an argument.
# Syntax: recommend <userId> <productId>
> recommend 202 50
> recommend 201 50
> recommend 203 5

Expected output: all the productId that we recommend the user based on the algorithm, with one whitespace between them. (if the command fails, we should see an empty line).

![Recommend Command Example](./images/recommend_example.png)

3.HELP
Use the help command to print all the possible commands/
# Syntax: help
> help

Expected output: all the command's syntax - each command and its syntax is printed in a different line.

![Help Menu Example](./images/help_example.png)