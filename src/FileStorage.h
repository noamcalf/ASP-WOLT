#ifndef FILE_STORAGE_H
#define FILE_STORAGE_H

#include "IStorage.h"
#include <string>
#include <vector>
#include <unordered_map>

// FileStorage class implements IStorage to persist data to a text file.
// Uses an Append-Only format: Each line represents a single action "UserId ProductId"
class FileStorage : public IStorage {
private:
    // The path to our text file (e.g., "data/history.txt")
    std::string filePath; 
    
    // In-memory cache to quickly access data without reading the file every time.
    // Key: userId, Value: vector of productIds
    std::unordered_map<int, std::vector<int>> memoryCache;

    // Helper function: Loads data from the text file into the memoryCache on startup.
    void loadFromFile();

public:
    // Constructor: Initializes the storage with a file path and loads existing data.
    explicit FileStorage(const std::string& path);

    // Destructor
    ~FileStorage() override = default;

    // IStorage interface overrides
    void saveUserProduct(int userId, int productId) override;
    std::vector<int> getUserHistory(int userId) const override;
    std::vector<int> getAllUserIds() const override;
};

#endif // FILE_STORAGE_H