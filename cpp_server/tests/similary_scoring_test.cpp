#include <gtest/gtest.h>
#include "HistoryManager.h"
#include "IStorage.h"
#include "MockStorage.h"

TEST(HistoryManagerTest, SimilarityScoreTest) {
    // Setup
    MockStorage fakeStorage;
    HistoryManager manager(fakeStorage);

    // Get the data directly into the fake storage
    fakeStorage.mockDataMap[1] = {101, 102, 103};
    fakeStorage.mockDataMap[2] = {101, 102, 104};
    fakeStorage.mockDataMap[3] = {101, 105, 106};
    fakeStorage.mockDataMap[4] = {};

    // Compare the actions to the wanted answear
    EXPECT_EQ(manager.getSimilarityScore(1, 2), 2); 
    EXPECT_EQ(manager.getSimilarityScore(1, 3), 1); 
    EXPECT_EQ(manager.getSimilarityScore(1, 1), 3);
    EXPECT_EQ(manager.getSimilarityScore(4, 2), 0);
    EXPECT_EQ(manager.getSimilarityScore(4, 4), 0);
}