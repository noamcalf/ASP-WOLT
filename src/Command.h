// In the compilation stage- if you see this file during this compilation, ignore it
#pragma once

#include <string>
#include <vector>

// An easy way to defer the different comman types
enum class CommandType {
    RECOMMEND,
    ADD,
    HELP,
    INVALID
};

// The way the app should get the data from the user
struct Command {
    CommandType type;
    std::vector<std::string> arguments;
    // rawInput field is for returnning what the user enterd in case of an error
    std::string rawInput;
};