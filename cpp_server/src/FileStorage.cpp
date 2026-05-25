#include "FileStorage.h"
#include <fstream>
#include <sstream>
#include <filesystem>
#include <algorithm>

using namespace std;


// Constructor: Initializes the file path and triggers the initial data load
FileStorage::FileStorage(const string& path) : filePath(path) {
    // Call the helper function to populate the cache immediately upon creation
    loadFromFile();
}

void FileStorage::loadFromFile() {
    // Make sure the file excists
    if (!(filesystem::exists(filePath))) {
        return; 
    }

    // Open the file
    ifstream inFile(filePath);
    // Make sure we can open the file and read from it
    if (!inFile.is_open()) {
        // Can't use getline() and read, history wont be save
        return;
    }

    string line;
    // Read line-by-line , until EOF
    while (getline(inFile, line)) {
        // Empty lines are not relevant
        if (line.empty()) continue; 

        // Create new stringstream to get uId, pId 
        std::stringstream strs(line);
        // Create variabels
        int uId, pId;

        // Use the stream rules with operator >> : the first value that is not whitespaces is uId (the read ends with the first whitespace)
        // We will skip more whitespaces, and then: the second value is pId (the read ends with the first whitespace)
        if (strs >> uId >> pId) {
            memoryCache[uId].push_back(pId);
        }
    }
    // Close the file 
    inFile.close();
}

void FileStorage::saveUserProduct(int userId, int productId) {
    // Get the data into the memoryCache
    memoryCache[userId].push_back(productId);

    // Open the file for writing
    ofstream outFile(filePath, ios::app);
    // Make sure the command above worked
    if (outFile.is_open()) {
        // Append the wanted data
        outFile << userId << " " << productId << "\n";
        // Close the file
        outFile.close();
    }
}

vector<int> FileStorage::getUserHistory(int userId) const {
    // Search the userId in the memoryCache
    auto it = memoryCache.find(userId);
    // If userId found
    if (it != memoryCache.end()) {
        // return the products vector
        return it->second;
    }
    // In case the user has not been found
    return {};
}

vector<int> FileStorage::getAllUserIds() const {
    // Make an int vector for the return value
    vector<int> usersVector;
    // for each pair of <userId, std::vector<int> productsVector>
    for (const auto& [userId, products] : memoryCache) {
        // Add only the userId to the vector
        usersVector.push_back(userId);
    }
    return usersVector; 
}

// Checks if a specific user ID has any existing records in the storage
bool FileStorage::userExists(int userId) const {
    return memoryCache.find(userId) != memoryCache.end();
}

void FileStorage::saveFromCacheToFile() {
    // Delete the file content for re-write (also openning it)
    ofstream outFile(filePath);
    // Make sure the file is open
    if (!outFile.is_open()) return;

    // Copy all the data from the cache to the file
    for (const auto& [uId, products] : memoryCache) {
        for (int pId : products) {
            outFile << uId << " " << pId << "\n";
        }
    }
    // Close the file
    outFile.close();
}

// Removes all instances of a specific product ID for a given user from the file
void FileStorage::deleteProducts(int userId, int productId) {
    // Search the userId in the memoryCache
    auto user = memoryCache.find(userId);
    // Flag for changinf the data
    bool flag = false;
    // If userId found
    if (user != memoryCache.end()) {
        // Search for the specific productId in the userId's products vector
        for (auto it = user->second.begin(); it != user->second.end(); ) {
            // We found the wanted product, delete it
            if (*it == productId) {
            // Delete from cache
            it = user->second.erase(it);
            // Flag that change has been made
            flag = true;
            // Skip the producrId
            } else {
            it++;
            }
        }
        // Update file if we changed somthing
        if (flag) {
            saveFromCacheToFile();
        }
    }
}