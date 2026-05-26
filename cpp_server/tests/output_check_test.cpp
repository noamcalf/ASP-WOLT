#include <gtest/gtest.h>
#include <string>
#include <vector>
#include "../src/CommandDispatcher.h"
#include "../src/Command.h"
#include "MockHistoryManager.h"
#include "MockStorage.h"

// Help output
TEST(OutputCheckTest, HelpCommandOutput) {
    // Init
    MockStorage storage;
    MockHistoryManager mockHM(storage);
    CommandDispatcher dispatcher(mockHM);

    // Create the Command struct for the dispatcher
    Command rawCmd;
    rawCmd.type = CommandType::HELP;

    // Save the output we got from running "help"
    std::string output = dispatcher.dispatch(rawCmd);

    // Expected output: Strictly alphabetically sorted, 'help' is always last
    std::string expected = 
        "DELETE, arguments: [userid] [productid1] [productid2] ...\n"
        "GET, arguments: [userid] [productid]\n"
        "PATCH, arguments: [userid] [productid1] [productid2] ...\n"
        "POST, arguments: [userid] [productid1] [productid2] ...\n"
        "help\n";

    EXPECT_EQ(output, expected);
}

// Recommend (GET) Command Output Tests
TEST(OutputCheckTest, RecommendCommandFormatting) {
    // Init
    MockStorage storage;
    MockHistoryManager mockHM(storage);
    CommandDispatcher dispatcher(mockHM);

    // Create fakeRecommendationsToReturn for the mock history manager
    mockHM.fakeRecommendationsToReturn = {101, 202, 303};

    // Create the Command struct for the dispatcher
    Command rawCmd;
    rawCmd.type = CommandType::RECOMMEND;
    rawCmd.arguments = {"1", "100"};

    // Save the output we got from running "recommend"
    std::string output = dispatcher.dispatch(rawCmd);

    // The expected output
    EXPECT_EQ(output, "200 Ok\n\n101 202 303\n");
}

// Recommend edge cases
TEST(OutputCheckTest, RecommendEdgeCases) {
    // Init
    MockStorage storage;
    MockHistoryManager mockHM(storage);
    CommandDispatcher dispatcher(mockHM);

    // Create the Command struct for the dispatcher
    Command rawCmd;
    rawCmd.type = CommandType::RECOMMEND;
    rawCmd.arguments = {"1", "100"};

    // Empty recomendation vector
    mockHM.fakeRecommendationsToReturn = {}; 
    std::string outputEmpty = dispatcher.dispatch(rawCmd);
    EXPECT_EQ(outputEmpty, "200 Ok\n\n\n");

    // More then 10 recommendations
    // We expect the output to contain ALL 12 items. This proves that the 
    // RecommendCommand strictly handles formatting and does NOT enforce the 10-item 
    // limit (which is the sole responsibility of the HistoryManager engine).
    mockHM.fakeRecommendationsToReturn = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
    std::string outputLimit = dispatcher.dispatch(rawCmd);
    EXPECT_EQ(outputLimit, "200 Ok\n\n1 2 3 4 5 6 7 8 9 10 11 12\n");
}

// POST, PATCH Output Tests
TEST(OutputCheckTest, PostCommandOutput) {
    MockStorage storage;
    MockHistoryManager mockHM(storage);
    CommandDispatcher dispatcher(mockHM);

    Command rawCmd = {CommandType::ADD, {"1", "101"}, "POST 1 101"};
    
    // Success Case: User doesn't exist yet -> 201 Created
    mockHM.mockUserExistsResult = false;
    EXPECT_EQ(dispatcher.dispatch(rawCmd), "201 Created\n");

    // Failure Case: User already exists -> 404 Not Found
    mockHM.mockUserExistsResult = true;
    EXPECT_EQ(dispatcher.dispatch(rawCmd), "404 Not Found\n");
}

TEST(OutputCheckTest, PatchCommandOutput) {
    MockStorage storage;
    MockHistoryManager mockHM(storage);
    CommandDispatcher dispatcher(mockHM);

    Command rawCmd = {CommandType::PATCH, {"1", "101"}, "PATCH 1 101"};
    
    // Success Case: User exists -> 204 No Content
    mockHM.mockUserExistsResult = true;
    EXPECT_EQ(dispatcher.dispatch(rawCmd), "204 No Content\n");

    // Failure Case: User doesn't exist -> 404 Not Found
    mockHM.mockUserExistsResult = false;
    EXPECT_EQ(dispatcher.dispatch(rawCmd), "404 Not Found\n");
}

// DELETE Output Tests
TEST(OutputCheckTest, DeleteCommandOutput) {
    MockStorage storage;
    MockHistoryManager mockHM(storage);
    CommandDispatcher dispatcher(mockHM);

    Command rawCmd = {CommandType::DELETE, {"1", "101"}, "DELETE 1 101"};
    
    // Success Case: Product successfully removed -> 204 No Content
    mockHM.mockRemoveProductResult = true;
    EXPECT_EQ(dispatcher.dispatch(rawCmd), "204 No Content\n");

    // Failure Case: Product or user not found -> 404 Not Found
    mockHM.mockRemoveProductResult = false;
    EXPECT_EQ(dispatcher.dispatch(rawCmd), "404 Not Found\n");
}


TEST(OutputCheckTest, InvalidCommandReturns400) {
    // Init
    MockStorage storage;
    MockHistoryManager mockHM(storage);
    CommandDispatcher dispatcher(mockHM);

    // Create the Command struct for the dispatcher: Invalid command
    Command invalidCmd;
    invalidCmd.type = CommandType::INVALID;

    std::string outputInvalid = dispatcher.dispatch(invalidCmd);
    EXPECT_EQ(outputInvalid, "400 Bad Request\n");

    // Create the Command struct for the dispatcher: Invalid command with arguments
    Command incompleteAdd3;
    incompleteAdd3.type = CommandType::INVALID;
    incompleteAdd3.arguments = {"1","2","3","4"}; 
    std::string outputIncomplete = dispatcher.dispatch(incompleteAdd3);
    EXPECT_EQ(outputIncomplete, "400 Bad Request\n");

    // Invalid string arguments (should be caught by exception handler in dispatcher)
    Command badArgsCmd;
    badArgsCmd.type = CommandType::ADD;
    badArgsCmd.arguments = {"not", "a", "number"}; 
    std::string outputBadArgs = dispatcher.dispatch(badArgsCmd);
    EXPECT_EQ(outputBadArgs, "400 Bad Request\n");
}