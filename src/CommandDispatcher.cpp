#include "CommandDispatcher.h"

// Constructor
CommandDispatcher::CommandDispatcher(HistoryManager& manager) : historyManager(manager) {}

// Dispatch
void CommandDispatcher::dispatch(const Command& rawCommand) {
    // TODO: Switch/if-else over rawCommand.type.
    // For ADD: Extract userId and productIds using std::stoi, create AddCommand and execute.
    // For RECOMMEND: Extract userId and productId using std::stoi, create RecommendCommand and execute.
    // For HELP: Create HelpCommand and execute.
    // For INVALID: Do nothing.
    // Make sure to catch exceptions from std::stoi
}