#pragma once

#include "Command.h"
#include <string>

class IInputParser {
public:
    // We have at least one virtual func, so we have to set virtual distructor.
    virtual ~IInputParser() = default;

    // Its an interface, so the compiler should wait to get the "run-time" type of an object to know which "prase" func to run.
    // There is no default implementation, every kind of IInputParser will have to implememnt this func.
    virtual Command parse(const std::string& input) = 0;
};