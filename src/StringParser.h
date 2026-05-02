#pragma once
#include "IInputParser.h"

class StringParser : public IInputParser {
public:
    // Implement in WOLT-30
    Command parse(const std::string& input) override {
        return {CommandType::INVALID, {}, input};
    }
};