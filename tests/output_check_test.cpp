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
    testing::internal::CaptureStdout();
    dispatcher.dispatch(rawCmd);
    std::string output = testing::internal::GetCapturedStdout();

    // The expected output
    std::string expected = 
        "add [userid] [productid1] [productid2] ...\n"
        "recommend [userid] [productid]\n"
        "help\n";

    EXPECT_EQ(output, expected);
}

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
    testing::internal::CaptureStdout();
    dispatcher.dispatch(rawCmd);
    std::string output = testing::internal::GetCapturedStdout();

    // The expected output
    EXPECT_EQ(output, "101 202 303\n");
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
    testing::internal::CaptureStdout();
    dispatcher.dispatch(rawCmd);
    std::string outputEmpty = testing::internal::GetCapturedStdout();
    EXPECT_EQ(outputEmpty, "\n");

    // More then 10 recommendations
    mockHM.fakeRecommendationsToReturn = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
    testing::internal::CaptureStdout();
    dispatcher.dispatch(rawCmd);
    std::string outputLimit = testing::internal::GetCapturedStdout();
    EXPECT_EQ(outputLimit, "1 2 3 4 5 6 7 8 9 10\n");
}

TEST(OutputCheckTest, InvalidCommandSilence) {
    // Init
    MockStorage storage;
    MockHistoryManager mockHM(storage);
    CommandDispatcher dispatcher(mockHM);

    // Save the printed data
    testing::internal::CaptureStdout();

    // Valid ADD - should remain silent
    Command validAdd;
    validAdd.type = CommandType::ADD;
    validAdd.arguments = {"1", "101", "102"};
    dispatcher.dispatch(validAdd);
    
    // Create the Command struct for the dispatcher: Invalid command
    Command invalidCmd;
    invalidCmd.type = CommandType::INVALID;
    dispatcher.dispatch(invalidCmd);

    // Create the Command struct for the dispatcher: Incomlete add command
    Command incompleteAdd1;
    incompleteAdd1.type = CommandType::ADD;
    incompleteAdd1.arguments = {"1"}; 
    dispatcher.dispatch(incompleteAdd1);

    // Create the Command struct for the dispatcher: Invalid command with arguments
    Command incompleteAdd3;
    incompleteAdd3.type = CommandType::INVALID;
    incompleteAdd3.arguments = {"1","2","3","4"}; 
    dispatcher.dispatch(incompleteAdd3);
    
    // Get the data we saved
    std::string output = testing::internal::GetCapturedStdout();

    EXPECT_TRUE(output.empty());
}