#include "StringParser.h"
#include <vector>
#include <string>

using std::vector;
using std::string;

Command StringParser::parse(const std::string& input) {
    // Define variables to help with string splitting
    vector<string> tokens;
    string current_token = "";

    // Iterate through the input string character by character
    for (char c : input) {
        if (c == ' ') {
            // Space found: push the collected token (if any) and reset
            if (!current_token.empty()) {
                tokens.push_back(current_token);
                current_token = "";
            }
        }
        else {
            // Regular character: add it to the current token
            current_token += c;
        }
    }

    // Push the last token if the string didn't end with a space
    if (!current_token.empty()) {
        tokens.push_back(current_token);
    }

    // Validation: If no tokens were found (empty input or only spaces)
    if (tokens.empty()) {
        return {CommandType::INVALID, {}, input};
    }

    // Identify and validate the command
    // The first token is always the command name
    string commandName = tokens[0];
    // Everything after the first token is an argument
    vector<string> arguments(tokens.begin() + 1, tokens.end());

    // Case: 'add' command - requires at least 2 arguments (user and product)
    if (commandName == "add" && arguments.size() >= 2) {
        return {CommandType::ADD, arguments, input};
    } 
    // Case: 'recommend' command - requires exactly 2 arguments (user and product)
    else if (commandName == "recommend" && arguments.size() == 2) {
        return {CommandType::RECOMMEND, arguments, input};
    } 
    // Case: 'help' command - requires zero arguments
    else if (commandName == "help" && arguments.empty()) {
        return {CommandType::HELP, arguments, input};
    }

    // If command name is unknown or arguments are invalid
    return {CommandType::INVALID, arguments, input};
}