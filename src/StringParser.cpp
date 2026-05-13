#include "StringParser.h"
#include <vector>
#include <string>

using namespace std;

Command StringParser::parse(const string& input) {
    // Make sure there is no '/t' label in the input
    if (input.find('\t') != string::npos) {
        return {CommandType::INVALID, {}, input};
    }

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

    // POST: Replaces 'add' - requires at least 2 arguments (user and product)
    if (commandName == "POST" && arguments.size() >= 2) {
        return {CommandType::ADD, arguments, input};
    } 
    // GET: Replaces 'recommend' - requires exactly 2 arguments (user and product)
    else if (commandName == "GET" && arguments.size() == 2) {
        return {CommandType::RECOMMEND, arguments, input};
    } 
    // PATCH: New command - similar syntax to POST (at least 2 arguments)
    else if (commandName == "PATCH" && arguments.size() >= 2) {
        return {CommandType::PATCH, arguments, input};
    }
    // DELETE: New command - requires at least 2 arguments
    else if (commandName == "DELETE" && arguments.size() >= 2) {
        return {CommandType::DELETE, arguments, input};
    }
    // help: Remains the same, requires zero arguments
    else if (commandName == "help" && arguments.empty()) {
        return {CommandType::HELP, arguments, input};
    }
    // If command name is unknown or arguments are invalid
    return {CommandType::INVALID, arguments, input};
}