#include <gtest/gtest.h>
// Simple math test to ensure GTest is linked correctly
TEST(Wolt24Task, BasicMathSanity) {
    EXPECT_EQ(1 + 1, 2);
}

// Verification that the test environment is running as expected
TEST(Wolt24Task, EnvironmentCheck) {
    ASSERT_TRUE(true);
}

// Example of a failing test (comment this out later)
// TEST(Wolt24Task, FailingTestExample) {
//    EXPECT_EQ(1, 2);
// }