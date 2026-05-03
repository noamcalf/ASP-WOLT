#include "CommandDispatcher.h"
#include "AddCommand.h"
#include "RecommendCommand.h"
#include "HelpCommand.h"

// Constructor
CommandDispatcher::CommandDispatcher(HistoryManager& manager) : historyManager(manager) {
    // push all the commands except helpCommand 
    commandPrototypes.push_back(std::make_shared<AddCommand>(historyManager, 0, std::vector<int>{}));
    commandPrototypes.push_back(std::make_shared<RecommendCommand>(historyManager, 0, 0));
    
    // creat "helpCommand" object with the vector and the commands we've pushed
    auto helpProto = std::make_shared<HelpCommand>(commandPrototypes);

    // Now, push the "helpCommand" object - to prevent an infinate loop because of "helpCommand" instructor
    commandPrototypes.push_back(helpProto);
}

void CommandDispatcher::dispatch(const Command& rawCommand) {
    try {
        switch (rawCommand.type) {
            case CommandType::ADD: {
                // Get the UID and use stoi to make it int
                int uId = std::stoi(rawCommand.arguments[0]);
                // Create vector for the arguments, use stoi to make each one of them an int
                std::vector<int> pIds;
                for (size_t count = 1; count < rawCommand.arguments.size(); count++) {
                    pIds.push_back(std::stoi(rawCommand.arguments[count]));
                }

                // Create the right object, call execute()
                AddCommand ac(historyManager, uId, pIds);
                ac.execute();
                break;
            }

            case CommandType::RECOMMEND: {
                // Get the UID, PID and use stoi to make them int
                int uId = std::stoi(rawCommand.arguments[0]);
                int pId = std::stoi(rawCommand.arguments[1]);

                // Create the right object, call execute()
                RecommendCommand rc(historyManager, uId, pId);
                rc.execute();
                break;
            }

            case CommandType::HELP: {
                // Create the right object, call execute()
                HelpCommand hc(commandPrototypes); 
                hc.execute();
                break;
            }

            case CommandType::INVALID:
            default:
                break;
        }

    } catch (const std::exception& e) {
        // Catch exceptions from std::stoi as requested in TODO, do nothing
    }
}