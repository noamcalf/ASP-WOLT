#include <gtest/gtest.h>
#include "FileStorage.h"
#include <fstream>
#include <cstdio>

// Test 1: Handle reading from a non-existent file
TEST(FileStorageTest, HandlesNonExistentFile) {
    // Define a file name that we are sure does not exist
    std::string testFile = "non_existent_data.txt";
    std::remove(testFile.c_str()); // Ensure it's deleted if left over from a previous run

    // Initialize FileStorage with this file path
    FileStorage storage(testFile);

    // It should not crash, and should return empty histories
    EXPECT_TRUE(storage.getUserHistory(1).empty());
    EXPECT_TRUE(storage.getAllUserIds().empty());
}

// Test 2: Write sample data and assert it matches upon reading
TEST(FileStorageTest, SavesAndLoadsDataAcrossSessions) {
    // Define a temporary file for testing
    std::string testFile = "save_load_test_data.txt";
    std::remove(testFile.c_str()); // Start with a clean slate

    // Open storage, write data, and close it
    {
        FileStorage storageOut(testFile);
        storageOut.saveUserProduct(1, 101); 
        storageOut.saveUserProduct(1, 102); 
        storageOut.saveUserProduct(2, 201);
    } // storageOut goes out of scope here. It simulates the program shutting down.

    // Open a NEW storage instance on the same file
    {
        FileStorage storageIn(testFile);
        std::vector<int> user1History = storageIn.getUserHistory(1);
        std::vector<int> user2History = storageIn.getUserHistory(2);

        // Verify the data was loaded correctly from the file
        ASSERT_EQ(user1History.size(), 2);
        EXPECT_EQ(user1History[0], 101);
        EXPECT_EQ(user1History[1], 102);

        ASSERT_EQ(user2History.size(), 1);
        EXPECT_EQ(user2History[0], 201);
    }

    // Delete the temporary test file so we don't leave trash behind
    std::remove(testFile.c_str());
}

// Test 3: Verify the exact text format in the raw file (Append-Only Log Format)
TEST(FileStorageTest, VerifiesExactFileFormat) {
    std::string testFile = "format_test_data.txt";
    std::remove(testFile.c_str());

    {
        FileStorage storage(testFile);
        storage.saveUserProduct(5, 501);
        storage.saveUserProduct(5, 502);
    } // The block closes, forcing the data to be written to the file

    // Read the raw file to check the actual format written to the disk
    std::ifstream inFile(testFile);
    std::string line1, line2;
    std::getline(inFile, line1);
    std::getline(inFile, line2);

    // Expecting each action to be a separate line: "UserId ProductId"
    EXPECT_EQ(line1, "5 501");
    EXPECT_EQ(line2, "5 502");

    std::remove(testFile.c_str());
}

#include <algorithm> // Required for std::find

// Test 4: Verify getAllUserIds returns all unique users from the storage
TEST(FileStorageTest, RetrievesAllUserIds) {
    // Define the test file name and ensure a clean state
    std::string testFile = "users_test_data.txt";
    std::remove(testFile.c_str()); 

    // Create storage, add data, and let it save
    {
        FileStorage storage(testFile);
        storage.saveUserProduct(10, 100); 
        storage.saveUserProduct(20, 200);
        storage.saveUserProduct(10, 101); 
    } // simulating a program exit.

    // Open a new storage instance to read the saved data from disk
    FileStorage storageIn(testFile);
    std::vector<int> users = storageIn.getAllUserIds();
    
    // Check that the returned data is correct
    // First, verify we got exactly 2 unique users (User 10 and User 20)
    ASSERT_EQ(users.size(), 2);
    
    // we use std::find to check if each ID simply exists anywhere in the vector.
    // std::find returns an iterator. If the item is not found, it returns users.end().
    EXPECT_TRUE(std::find(users.begin(), users.end(), 10) != users.end());
    EXPECT_TRUE(std::find(users.begin(), users.end(), 20) != users.end());

    // Delete the temporary test file so we don't leave trash behind
    std::remove(testFile.c_str());
}