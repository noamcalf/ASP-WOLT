#include <gtest/gtest.h>
#include <string>
#include <vector>

#include "AddCommand.h"
#include "RecommendCommand.h"
#include "HelpCommand.h"
#include "CommandDispatcher.h"
#include "Command.h"
#include "MockStorage.h"
#include "MockHistoryManager.h"

// Verify that executing an AddCommand calls the correct methods in the history manager
TEST(CommandExecutionTest, AddCommandCallsHistoryManager) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    
    std::vector<int> products = {101, 102};
    AddCommand addCmd(mockManager, 1, products);
    
    // Execute the command
    addCmd.execute();
    
    // Check our manual mock to see if it recorded exactly 2 calls
    EXPECT_EQ(mockManager.addProductCalls.size(), 2);
    if (mockManager.addProductCalls.size() == 2) {
        // Verify the exact arguments passed to addProductToUser
        EXPECT_EQ(mockManager.addProductCalls[0].first, 1);    // userId
        EXPECT_EQ(mockManager.addProductCalls[0].second, 101); // productId 1
        EXPECT_EQ(mockManager.addProductCalls[1].first, 1);    // userId
        EXPECT_EQ(mockManager.addProductCalls[1].second, 102); // productId 2
    }
}

// Verify that executing a RecommendCommand calls the correct methods in the recommendation engine
TEST(CommandExecutionTest, RecommendCommandCallsHistoryManager) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    
    // Set up the fake data our mock should return
    mockManager.fakeRecommendationsToReturn = {201, 202, 203};
    
    RecommendCommand recCmd(mockManager, 1, 101);
    
    // Execute the command
    // We capture stdout here because RecommendCommand will probably print the result
    testing::internal::CaptureStdout(); 
    recCmd.execute(); 
    testing::internal::GetCapturedStdout(); // Clean up capture
    
    // Verify the method was called exactly once with the right arguments
    EXPECT_EQ(mockManager.getRecommendationsCallCount, 1);
    EXPECT_EQ(mockManager.lastRecUserId, 1);
    EXPECT_EQ(mockManager.lastRecProductId, 101);
}

// Verify that RecommendCommand does not crash if the recommendation engine returns an empty list
TEST(CommandExecutionTest, RecommendCommandHandlesEmptyList) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    
    // Empty vector to return
    mockManager.fakeRecommendationsToReturn = {};
    
    // Execute the command
    RecommendCommand recCmd(mockManager, 1, 101);
    
    // Verify
    testing::internal::CaptureStdout(); 
    EXPECT_NO_THROW(recCmd.execute());
    testing::internal::GetCapturedStdout();
}

// Verify that executing a 'help' command exactly matches the PDF requirements
TEST(CommandExecutionTest, HelpCommandDisplaysList) {
    HelpCommand helpCmd;
    
    // Capture std::cout
    testing::internal::CaptureStdout();
    
    // Execute the command
    helpCmd.execute();
    
    // Verify exact string match
    std::string output = testing::internal::GetCapturedStdout();
    std::string expectedOutput = "add [userid] [productid1] [productid2] ...\n"
                                 "recommend [userid] [productid]\n"
                                 "help\n";
                                 
    EXPECT_EQ(output, expectedOutput);
}

// Verify that the CommandDispatcher correctly routes an ADD command to the HistoryManager
TEST(CommandExecutionTest, DispatcherRoutesAddCommandCorrectly) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    CommandDispatcher dispatcher(mockManager);

    // Create a raw Command struct representing "add 2 205"
    Command rawCmd = {CommandType::ADD, {"2", "205"}, "add 2 205"};
    
    // Execute
    dispatcher.dispatch(rawCmd);
    
    // Check if the dispatcher successfully invoked AddCommand which in turn called the manager
    EXPECT_EQ(mockManager.addProductCalls.size(), 1);
    if (mockManager.addProductCalls.size() == 1) {
        EXPECT_EQ(mockManager.addProductCalls[0].first, 2);
        EXPECT_EQ(mockManager.addProductCalls[0].second, 205);
    }
}

// Verify that the CommandDispatcher ignores INVALID commands and does not affect the engine
TEST(CommandExecutionTest, DispatcherIgnoresInvalidCommand) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    CommandDispatcher dispatcher(mockManager);

    // Create an invalid command
    Command rawCmd = {CommandType::INVALID, {}, "some bad input"};
    
    // Execute
    dispatcher.dispatch(rawCmd);
    
    // Strictly expect NO calls to be made to the history manager
    EXPECT_EQ(mockManager.addProductCalls.size(), 0);
    EXPECT_EQ(mockManager.getRecommendationsCallCount, 0);
}