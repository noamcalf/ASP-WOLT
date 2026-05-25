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
    vector<int> recommendations = manager.getRecommendations(1, 104);

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

TEST(HistoryManagerTest, LessThan10Recommendations) {
    MockStorage fakeStorage;
    HistoryManager manager(fakeStorage);

    // User 1 (Target): Watched products 10, 20, and the target product 99
    fakeStorage.mockDataMap[1] = {10, 20, 99};

    // User 2 (Valid recommender): Watched 10, 20, 99. 
    // Has 2 new products to recommend: 50, 51.
    fakeStorage.mockDataMap[2] = {10, 20, 99, 51, 50};

    // User 3 (Invalid recommender): Watched 10, 20, but DID NOT watch 99.
    // Their new products (52, 53) must be ignored!
    fakeStorage.mockDataMap[3] = {10, 20, 52, 53};

    // Get recommendations for User 1 based on product 99
    vector<int> recommendations = manager.getRecommendations(1, 99);

    // Assertions
    // We expect exactly 2 items, not 10.
    EXPECT_EQ(recommendations.size(), 2);
    
    // We expect products 50 and 51. Products 52 and 53 should not be there.
    vector<int> expected = {50, 51};
    EXPECT_EQ(recommendations, expected);
}

TEST(HistoryManagerTest, ZeroRecommendationsAvailable) {
    MockStorage fakeStorage;
    HistoryManager manager(fakeStorage);

    // User 1: Watched 1, 2, 3
    fakeStorage.mockDataMap[1] = {1, 2, 3};

    // User 2: Watched 1, Did not watch 3.
    fakeStorage.mockDataMap[2] = {1, 2, 4, 5};

    // User 3: Watched 1, 2, 3. BUT has no new products to offer.
    fakeStorage.mockDataMap[3] = {1, 2, 3};

    // Get recommendations for User 1 based on product 3
    vector<int> recommendations = manager.getRecommendations(1, 3);

    // Assertions
    // Expected to be completely empty
    EXPECT_TRUE(recommendations.empty());
}

TEST(HistoryManagerTest, TieBreakerAtTheLimit) {
    MockStorage fakeStorage;
    HistoryManager manager(fakeStorage);

    // User 1 (Target): Watched 1 and 99
    fakeStorage.mockDataMap[1] = {1, 99};

    // User 2: Watched 1 and 99 (Similarity = 2). 
    // Has 15 new products. 
    fakeStorage.mockDataMap[2] = {1, 99, 215, 214, 213, 212, 211, 210, 209, 208, 207, 206, 205, 204, 203, 202, 201};

    // Get recommendations for User 1 based on product 99
    vector<int> recommendations = manager.getRecommendations(1, 99);

    // Assertions
    EXPECT_EQ(recommendations.size(), 10); // Must be exactly 10
    
    // We expect the 10 products with the lowest IDs, sorted.
    // Out of 201-215, the lowest 10 are 201 to 210.
    vector<int> expected = {201, 202, 203, 204, 205, 206, 207, 208, 209, 210};
    EXPECT_EQ(recommendations, expected);
}

TEST(HistoryManagerTest, SingleUserInSystem) {
    MockStorage fakeStorage;
    HistoryManager manager(fakeStorage);

    // User 1 (Target): The only user in the entire database.
    fakeStorage.mockDataMap[1] = {10, 20, 99};

    // Get recommendations for User 1 based on product 99
    vector<int> recommendations = manager.getRecommendations(1, 99);

    // Assertions
    // Since there are no other users, there can be no recommendations.
    // The vector must be completely empty.
    EXPECT_TRUE(recommendations.empty());
}