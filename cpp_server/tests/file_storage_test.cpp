#include <gtest/gtest.h>
#include "FileStorage.h"
#include <fstream>
#include <cstdio>

using namespace std;

// Test 1: Handle reading from a non-existent file
TEST(FileStorageTest, HandlesNonExistentFile) {
    // Define a file name that we are sure does not exist
    string testFile = "non_existent_data.txt";
    remove(testFile.c_str()); // Ensure it's deleted if left over from a previous run

    // Initialize FileStorage with this file path
    FileStorage storage(testFile);

    // It should not crash, and should return empty histories
    EXPECT_TRUE(storage.getUserHistory(1).empty());
    EXPECT_TRUE(storage.getAllUserIds().empty());
}

// Test 2: Write sample data and assert it matches upon reading
TEST(FileStorageTest, SavesAndLoadsDataAcrossSessions) {
    // Define a temporary file for testing
    string testFile = "save_load_test_data.txt";
    remove(testFile.c_str()); // Start with a clean slate

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
        vector<int> user1History = storageIn.getUserHistory(1);
        vector<int> user2History = storageIn.getUserHistory(2);

        // Verify the data was loaded correctly from the file
        ASSERT_EQ(user1History.size(), 2);
        EXPECT_EQ(user1History[0], 101);
        EXPECT_EQ(user1History[1], 102);

        ASSERT_EQ(user2History.size(), 1);
        EXPECT_EQ(user2History[0], 201);
    }

    // Delete the temporary test file so we don't leave trash behind
    remove(testFile.c_str());
}

// Test 3: Verify the exact text format in the raw file (Append-Only Log Format)
TEST(FileStorageTest, VerifiesExactFileFormat) {
    string testFile = "format_test_data.txt";
    remove(testFile.c_str());

    {
        FileStorage storage(testFile);
        storage.saveUserProduct(5, 501);
        storage.saveUserProduct(5, 502);
    } // The block closes, forcing the data to be written to the file

    // Read the raw file to check the actual format written to the disk
    ifstream inFile(testFile);
    string line1, line2;
    getline(inFile, line1);
    getline(inFile, line2);

    // Expecting each action to be a separate line: "UserId ProductId"
    EXPECT_EQ(line1, "5 501");
    EXPECT_EQ(line2, "5 502");

    remove(testFile.c_str());
}

#include <algorithm> // Required for std::find

// Test 4: Verify getAllUserIds returns all unique users from the storage
TEST(FileStorageTest, RetrievesAllUserIds) {
    // Define the test file name and ensure a clean state
    string testFile = "users_test_data.txt";
    remove(testFile.c_str()); 

    // Create storage, add data, and let it save
    {
        FileStorage storage(testFile);
        storage.saveUserProduct(10, 100); 
        storage.saveUserProduct(20, 200);
        storage.saveUserProduct(10, 101); 
    } // simulating a program exit.

    // Open a new storage instance to read the saved data from disk
    FileStorage storageIn(testFile);
    vector<int> users = storageIn.getAllUserIds();
    
    // Check that the returned data is correct
    // First, verify we got exactly 2 unique users (User 10 and User 20)
    ASSERT_EQ(users.size(), 2);
    
    // we use std::find to check if each ID simply exists anywhere in the vector.
    // std::find returns an iterator. If the item is not found, it returns users.end().
    EXPECT_TRUE(find(users.begin(), users.end(), 10) != users.end());
    EXPECT_TRUE(find(users.begin(), users.end(), 20) != users.end());

    // Delete the temporary test file so we don't leave trash behind
    remove(testFile.c_str());
}

// Test 5: Verify userExists correctly identifies if a user is in the system
TEST(FileStorageTest, ChecksIfUserExists) {
    string testFile = "user_exists_test_data.txt";
    remove(testFile.c_str());

    {
        FileStorage storage(testFile);
        storage.saveUserProduct(10, 100); 
    }

    FileStorage storageIn(testFile);
    
    // User 10 should exist, User 99 should not
    EXPECT_TRUE(storageIn.userExists(10));
    EXPECT_FALSE(storageIn.userExists(99));

    remove(testFile.c_str());
}

// Test 6: Verify deleteProducts removes a specific product without affecting other users sharing it
TEST(FileStorageTest, DeletesSpecificProductFromUser) {
    string testFile = "delete_product_test_data.txt";
    remove(testFile.c_str());

    // Setup initial data
    {
        FileStorage storage(testFile);
        storage.saveUserProduct(1, 101); 
        storage.saveUserProduct(1, 102); 
        storage.saveUserProduct(2, 101); // Shared product
        storage.saveUserProduct(2, 201); 
    }

    // Perform the deletion
    {
        FileStorage storageEdit(testFile);
        storageEdit.deleteProducts(1, 101); // Target only User 1
    }

    // Verify the product was successfully deleted
    {
        FileStorage storageIn(testFile);
        vector<int> user1History = storageIn.getUserHistory(1);
        vector<int> user2History = storageIn.getUserHistory(2);
        
        // User 1: 101 should be completely removed, 102 should remain
        EXPECT_TRUE(find(user1History.begin(), user1History.end(), 101) == user1History.end());
        EXPECT_TRUE(find(user1History.begin(), user1History.end(), 102) != user1History.end());
        
        // User 2: MUST still have 101 (since it was only deleted for User 1) AND 201
        EXPECT_TRUE(find(user2History.begin(), user2History.end(), 101) != user2History.end());
        EXPECT_TRUE(find(user2History.begin(), user2History.end(), 201) != user2History.end());
    }

    remove(testFile.c_str());
}

// Test 7: Verify deleting a non-existent product does not crash or corrupt data
TEST(FileStorageTest, DeletingNonExistentProductDoesNothing) {
    string testFile = "delete_missing_test_data.txt";
    remove(testFile.c_str());

    {
        FileStorage storage(testFile);
        storage.saveUserProduct(3, 301);
    }

    {
        FileStorage storageEdit(testFile);
        // User 3 exists, but doesn't have product 888. 
        // User 4 doesn't exist at all.
        storageEdit.deleteProducts(3, 888); 
        storageEdit.deleteProducts(4, 999); 
    }

    {
        FileStorage storageIn(testFile);
        vector<int> user3History = storageIn.getUserHistory(3);
        
        // User 3's original data must remain perfectly intact
        ASSERT_EQ(user3History.size(), 1);
        EXPECT_EQ(user3History[0], 301);
    }

    remove(testFile.c_str());
}