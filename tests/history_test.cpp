#include <gtest/gtest.h>
#include "HistoryManager.h"
#include "IStorage.h"
#include "MockStorage.h"

TEST(HistoryManagerTest, AddAndRetrieveUserHistory) {
    // 1. Create the fake storage
    MockStorage fakeStorage;
    
    // 2. Create the manager and inject the fake storage
    HistoryManager manager(fakeStorage);
    
    // 3. Add products
    manager.addProductToUser(1, 104);
    manager.addProductToUser(1, 105);

    // 4. Define expected outcome
    std::vector<int> expected = {104, 105};
    
    // 5. Assert
    EXPECT_EQ(manager.getUserHistory(1), expected);
}

// Verify checkUserExists returns correct boolean
TEST(HistoryManagerTest, CheckUserExistsCorrectly) {
    MockStorage fakeStorage;
    HistoryManager manager(fakeStorage);
    
    // User 2 doesn't exist yet
    EXPECT_FALSE(manager.checkUserExists(2));
    
    // Add a product, now user 2 should exist
    manager.addProductToUser(2, 200);
    EXPECT_TRUE(manager.checkUserExists(2));
}

// Verify removeProductFromUser removes the product and returns correct boolean
TEST(HistoryManagerTest, RemoveProductFromUserCorrectly) {
    MockStorage fakeStorage;
    HistoryManager manager(fakeStorage);
    
    // Setup: Add two products to User 3
    manager.addProductToUser(3, 301);
    manager.addProductToUser(3, 302);
    
    // Success Case: Remove existing product
    EXPECT_TRUE(manager.removeProductFromUser(3, 301));
    
    // Verify it was actually removed
    std::vector<int> expectedAfterRemove = {302};
    EXPECT_EQ(manager.getUserHistory(3), expectedAfterRemove);
    
    // Failure Case: Attempt to remove non-existing product
    EXPECT_FALSE(manager.removeProductFromUser(3, 999));
    
    // Failure Case: Attempt to remove from non-existing user
    EXPECT_FALSE(manager.removeProductFromUser(99, 301));
}