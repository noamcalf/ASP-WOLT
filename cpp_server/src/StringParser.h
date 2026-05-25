#pragma once
#include "IInputParser.h"

class StringParser : public IInputParser {
public:
    // Declare the parsing function.
    Command parse(const std::string& input) override;
};