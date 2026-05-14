#include "CommandDispatcher.h"
#include "AddCommand.h"
#include "RecommendCommand.h"
#include "PatchCommand.h"
#include "HelpCommand.h"

using namespace std;

// Constructor
CommandDispatcher::CommandDispatcher(HistoryManager& manager) : historyManager(manager) {
    // push all the commands except helpCommand 
    commandPrototypes.push_back(make_shared<AddCommand>(historyManager, 0, vector<int>{}));
    commandPrototypes.push_back(make_shared<RecommendCommand>(historyManager, 0, 0));
    
    // creat "helpCommand" object with the vector and the commands we've pushed
    auto helpProto = make_shared<HelpCommand>(commandPrototypes);

    // Now, push the "helpCommand" object - to prevent an infinate loop because of "helpCommand" instructor
    commandPrototypes.push_back(helpProto);
}

string CommandDispatcher::dispatch(const Command& rawCommand) {
    try {
        switch (rawCommand.type) {
            // Represents POST
            case CommandType::ADD: {
                // Get the UID and use stoi to make it int
                int uId = stoi(rawCommand.arguments[0]);
                // Check if the user is already exists
                bool exist = historyManager.checkUserExists(uId);
                if (exist) {
                    return "404 Not Found";
                }
                // Create vector for the arguments, use stoi to make each one of them an int
                vector<int> pIds;
                for (size_t count = 1; count < rawCommand.arguments.size(); count++) {
                    pIds.push_back(stoi(rawCommand.arguments[count]));
                }

                // Create the right object, call execute()
                AddCommand ac(historyManager, uId, pIds);
                return ac.execute();
            }

            case CommandType::PATCH: {
                // Get the UID and use stoi to make it int
                int uId = stoi(rawCommand.arguments[0]);
                // Check if the user is already exists
                bool exist = historyManager.checkUserExists(uId);
                if (!exist) {
                    return "404 Not Found";
                }
                // Create vector for the arguments, use stoi to make each one of them an int
                vector<int> pIds;
                for (size_t count = 1; count < rawCommand.arguments.size(); count++) {
                    pIds.push_back(stoi(rawCommand.arguments[count]));
                }

                // Create the right object, call execute()
                PatchCommand pc(historyManager, uId, pIds);
                return pc.execute();
            }

            case CommandType::RECOMMEND: {
                
                // Get the UID, PID and use stoi to make them int
                int uId = stoi(rawCommand.arguments[0]);
                int pId = stoi(rawCommand.arguments[1]);

                // Create the right object, call execute()
                RecommendCommand rc(historyManager, uId, pId);
                return rc.execute();
            }

            case CommandType::HELP: {
                // Create the right object, call execute()
                HelpCommand hc(commandPrototypes); 
                return hc.execute();
            }

            case CommandType::INVALID:
            default:
                return "";

            
        }

    } catch (const exception& e) {
        // Catch exceptions from stoi as requested, do nothing
        return "";
    }
}