#include <gtest/gtest.h>
#include <vector>
#include "HistoryManager.h"
#include "MockStorage.h"

using std::vector;

TEST(HistoryManagerTest, FullFlowRecommendationTest) {
    // Create storage and manager
    MockStorage fakeStorage;
    HistoryManager manager(fakeStorage);

    // Create the data
    fakeStorage.mockDataMap[1]  = {100, 101, 102, 103};
    fakeStorage.mockDataMap[2]  = {101, 102, 104, 105, 106};
    fakeStorage.mockDataMap[3]  = {100, 104, 105, 107, 108};
    fakeStorage.mockDataMap[4]  = {101, 105, 106, 107, 109, 110};
    fakeStorage.mockDataMap[5]  = {100, 102, 103, 105, 108, 111};
    fakeStorage.mockDataMap[6]  = {100, 103, 104, 110, 111, 112, 113};
    fakeStorage.mockDataMap[7]  = {102, 105, 106, 107, 108, 109, 110};
    fakeStorage.mockDataMap[8]  = {101, 104, 105, 106, 109, 111, 114};
    fakeStorage.mockDataMap[9]  = {100, 103, 105, 107, 112, 113, 115};
    fakeStorage.mockDataMap[10] = {100, 102, 105, 106, 107, 109, 110, 116};

    // Get recommendations for User 1
    vector<int> recommendations = manager.getRecommendations(1);

    // Check for exactly 10 items 
    EXPECT_EQ(recommendations.size(), 10);

    // Check that User 1 does not get products they already watched
    for (int prodId : recommendations) {
        EXPECT_NE(prodId, 100);
        EXPECT_NE(prodId, 101);
        EXPECT_NE(prodId, 102);
        EXPECT_NE(prodId, 103);
    }

    // Verify the exact expected array (Validates both weighted score and ascending ID sort)
    // Score 4: 105
    // Score 3: 106, 111
    // Score 2: 110, 112, 113
    // Score 1: 107, 108, 109, 114
    vector<int> expected = {105, 106, 111, 110, 112, 113, 107, 108, 109, 114};
    EXPECT_EQ(recommendations, expected);
}
