#include <gtest/gtest.h>
#include <string>
#include <vector>

#include "../src/AddCommand.h"
#include "../src/PatchCommand.h"
#include "../src/DeleteCommand.h"
#include "../src/RecommendCommand.h"
#include "../src/CommandDispatcher.h"
#include "../src/Command.h"
#include "MockStorage.h"
#include "MockHistoryManager.h"

// Verify POST (AddCommand) returns 201 Created and calls HistoryManager for all products
TEST(CommandExecutionTest, PostCommandExecution) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    
    std::vector<int> products = {101, 102, 103};
    AddCommand addCmd(mockManager, 1, products);
    
    std::string output = addCmd.execute();
    EXPECT_EQ(output, "201 Created");
    EXPECT_EQ(mockManager.addProductCalls.size(), 3);
}

// Verify PATCH (PatchCommand) returns 204 No Content
TEST(CommandExecutionTest, PatchCommandExecution) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    
    std::vector<int> products = {201};
    PatchCommand patchCmd(mockManager, 1, products);
    
    std::string output = patchCmd.execute();
    EXPECT_EQ(output, "204 No Content");
    EXPECT_EQ(mockManager.addProductCalls.size(), 1);
}

// Verify DELETE (DeleteCommand) returns 204 No Content
TEST(CommandExecutionTest, DeleteCommandExecutionSuccess) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    
    std::vector<int> products = {301};
    // Let's assume the mock's removeProductFromUser returns true by default
    DeleteCommand delCmd(mockManager, 1, products);
    
    // Success scenario
    mockManager.mockRemoveProductResult = true;
    EXPECT_EQ(delCmd.execute(), "204 No Content");

    // Failure scenario (product not found)
    mockManager.mockRemoveProductResult = false;
    EXPECT_EQ(delCmd.execute(), "404 Not Found");
}

// Verify that RecommendCommand returns just the products (Dispatcher wraps it later)
TEST(CommandExecutionTest, RecommendCommandExecution) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    
    mockManager.fakeRecommendationsToReturn = {201, 202, 203};
    RecommendCommand recCmd(mockManager, 1, 101);
    
    std::string output = recCmd.execute(); 
    EXPECT_EQ(output, "200 Ok\n\n201 202 203\n"); 
    EXPECT_EQ(mockManager.getRecommendationsCallCount, 1);
}

// Verify Dispatcher Routing for POST (ADD)
TEST(CommandExecutionTest, DispatcherRoutesPostCommandCorrectly) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    CommandDispatcher dispatcher(mockManager);

    Command rawCmd = {CommandType::ADD, {"2", "205"}, "POST 2 205"};
    mockManager.mockUserExistsResult = false; 
    
    dispatcher.dispatch(rawCmd);
    EXPECT_EQ(mockManager.addProductCalls.size(), 1);
    EXPECT_EQ(mockManager.addProductCalls[0].first, 2);
    EXPECT_EQ(mockManager.addProductCalls[0].second, 205);
}

// Verify Dispatcher Routing for PATCH
TEST(CommandExecutionTest, DispatcherRoutesPatchCommandCorrectly) {
    MockStorage mockStorage;
    MockHistoryManager mockManager(mockStorage);
    CommandDispatcher dispatcher(mockManager);

    Command rawCmd = {CommandType::PATCH, {"3", "305"}, "PATCH 3 305"};
    mockManager.mockUserExistsResult = true; // Must exist for PATCH
    
    dispatcher.dispatch(rawCmd);
    EXPECT_EQ(mockManager.addProductCalls.size(), 1);
    EXPECT_EQ(mockManager.addProductCalls[0].first, 3);
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