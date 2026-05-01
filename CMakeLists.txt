cmake_minimum_required(VERSION 3.14)
project(WoltProject)

# Use C++17 standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find GTest installed in the system (from Dockerfile)
find_package(GTest REQUIRED)

# Tell CMake to always look for header files in the src/ directory
include_directories(src)

# Building the main application executable separately from the tests
# TODO: Uncomment the line below when you create src/main.cpp in Epic 3!
# add_executable(wolt_app src/main.cpp src/HistoryManager.cpp)

# Configure Testing
enable_testing()

# Create a separate executable exclusively for running the unit tests
add_executable(wolt_tests
    tests/similary_scoring_test.cpp
    tests/history_test.cpp 
    tests/MockStorage.cpp 
    src/HistoryManager.cpp
)

# Link the test executable with Google Test libraries
target_link_libraries(wolt_tests GTest::GTest GTest::Main)

# Allow CTest to automatically discover our test cases
include(GoogleTest)
gtest_discover_tests(wolt_tests)