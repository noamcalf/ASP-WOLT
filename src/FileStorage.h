#ifndef FILE_STORAGE_H
#define FILE_STORAGE_H

#include "IStorage.h"
#include <string>
#include <vector>
#include <unordered_map>

// FileStorage class implements IStorage to persist data to a text file.
// Format inside the file will be: "UserId: ProductId1, ProductId2, ..."
class FileStorage : public IStorage {
private:
    // The path to our text file (e.g., "data/history.txt")
    std::string filePath; 
    
    // In-memory cache to quickly access and update data without reading the file every time.
    // Key: userId, Value: vector of productIds
    std::unordered_map<int, std::vector<int>> memoryCache;

    // Helper function: Loads data from the text file into the memoryCache.
    void loadFromFile();

    // Helper function: Writes the entire memoryCache to the text file in the required format.
    void flushToFile() const;

public:
    // Constructor: Initializes the storage with a file path and loads existing data.
    explicit FileStorage(const std::string& path);

    // Destructor: Default is fine since we don't dynamically allocate raw memory.
    ~FileStorage() override = default;

    // IStorage interface overrides
    void saveUserProduct(int userId, int productId) override;
    std::vector<int> getUserHistory(int userId) const override;
    std::vector<int> getAllUserIds() const override;
};

#endif