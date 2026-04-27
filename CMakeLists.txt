cmake_minimum_required(VERSION 3.14)
project(WoltProject)

# Use C++17 standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find GTest installed in the system (from Dockerfile)
find_package(GTest REQUIRED)
include_directories(${GTEST_INCLUDE_DIRS})

# Configure Testing
enable_testing()

# Define the test executable
add_executable(unit_tests tests.cpp)

# Link to GTest and GTest_Main libraries
# GTest_Main provides the main() function automatically
target_link_libraries(unit_tests GTest::GTest GTest::Main)

# Allow CTest to discover and list our tests
include(GoogleTest)
gtest_discover_tests(unit_tests)