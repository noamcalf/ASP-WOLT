#include <gtest/gtest.h>
#include <string>
#include <vector>
#include "../src/StringParser.h"
#include "../src/Command.h"

// POST command
TEST(ParserTest, ValidatePOSTCommandSyntax) {
    StringParser parser;
    
    // Valid: user and at least one product
    Command valid = parser.parse("POST user123 prod1");
    EXPECT_EQ(valid.type, CommandType::ADD);
    EXPECT_EQ(valid.arguments.size(), 2);

    // Valid: POST, user and 10 products
    Command cmd1 = parser.parse("POST u1 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10");
    EXPECT_EQ(cmd1.type, CommandType::ADD);
    EXPECT_EQ(cmd1.arguments.size(), 11);

    // Invalid: only "POST" command, or "POST" and user
    EXPECT_EQ(parser.parse("POST user123").type, CommandType::INVALID);
    EXPECT_EQ(parser.parse("POST").type, CommandType::INVALID);

    // Invalid: "POST" command should be written with only capital-letters
    EXPECT_EQ(parser.parse("Post 123 456").type, CommandType::INVALID);
}

// PATCH command
TEST(ParserTest, ValidatePATCHCommandSyntax) {
    StringParser parser;
    
    // Valid: user and at least one product
    Command valid = parser.parse("PATCH user123 prod1");
    EXPECT_EQ(valid.type, CommandType::ADD);
    EXPECT_EQ(valid.arguments.size(), 2);

    // Valid: PATCH, user and 10 products
    Command cmd1 = parser.parse("PATCH u1 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10");
    EXPECT_EQ(cmd1.type, CommandType::ADD);
    EXPECT_EQ(cmd1.arguments.size(), 11);

    // Invalid: only "PATCH" command, or "PATCH" and user
    EXPECT_EQ(parser.parse("PATCH user123").type, CommandType::INVALID);
    EXPECT_EQ(parser.parse("PATCH").type, CommandType::INVALID);

    // Invalid: "PATCH" command should be written with only capital-letters
    EXPECT_EQ(parser.parse("PAtch 123 456").type, CommandType::INVALID);
}

// GET command
TEST(ParserTest, ValidateGETCommandSyntax) {
    StringParser parser;
    
    // Valid: two arguments after the "GET" command
    Command valid = parser.parse("GET user123 prod456");
    EXPECT_EQ(valid.type, CommandType::RECOMMEND);
    ASSERT_EQ(valid.arguments.size(), 2);

    // Invalid: only command, or command and only user
    EXPECT_EQ(parser.parse("GET").type, CommandType::INVALID);
    EXPECT_EQ(parser.parse("GET user123").type, CommandType::INVALID);

    // Invalid: more then 2 arguments
    EXPECT_EQ(parser.parse("GET u1 p1 extra").type, CommandType::INVALID);

    // Invalid: "GET" command should be written with only capital-letters
    EXPECT_EQ(parser.parse("GeT 123 456").type, CommandType::INVALID);
}

// DELETE command
TEST(ParserTest, ValidateDELETECommandSyntax) {
    StringParser parser;
    
    // Valid: user and at least one product
    Command valid = parser.parse("DELETE user123 prod1");
    EXPECT_EQ(valid.type, CommandType::DELETE);
    EXPECT_EQ(valid.arguments.size(), 2);

    // Valid: DELETE, user and 10 products
    Command cmd1 = parser.parse("DELETE u1 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10");
    EXPECT_EQ(cmd1.type, CommandType::DELETE);
    EXPECT_EQ(cmd1.arguments.size(), 11);

    // Invalid: only "DELETE" command, or "DELETE" and user
    EXPECT_EQ(parser.parse("DELETE user123").type, CommandType::INVALID);
    EXPECT_EQ(parser.parse("DELETE").type, CommandType::INVALID);

    // Invalid: "DELETE" command should be written with only capital-letters
    EXPECT_EQ(parser.parse("DELEte 123 456 789").type, CommandType::INVALID);
}

// Help command
TEST(ParserTest, ValidateHelpCommandSyntax) {
    StringParser parser;
    
    // Valid: "help" command with no arguments
    Command valid = parser.parse("help");
    EXPECT_EQ(valid.type, CommandType::HELP);

    // Invalid: one argument after the "help" command
    EXPECT_EQ(parser.parse("help me").type, CommandType::INVALID);

    // Invalid: multiple arguments after the "help" command
    EXPECT_EQ(parser.parse("help me please now").type, CommandType::INVALID);
    
    // Invalid: help with lots of spaces and then arguments
    EXPECT_EQ(parser.parse("help    too many args").type, CommandType::INVALID);

    // Invalid: "help" command should be written with only lower-case letters
    EXPECT_EQ(parser.parse("HeLp").type, CommandType::INVALID);
}

// Handle whitespaces, tabs and invalid input
TEST(ParserTest, FlagsInvalidCommands) {
    StringParser parser;
    
    // INVAILD: wrong command type
    EXPECT_EQ(parser.parse("add user123").type, CommandType::INVALID);
    
    // INVAILD: empty string
    EXPECT_EQ(parser.parse("   ").type, CommandType::INVALID);
    
    // INVAILD: using tabs between words is not replacing whitespace 
    EXPECT_EQ(parser.parse("GET\tuser1\tprod1").type, CommandType::INVALID);

    // INVALID: just a tab string
    EXPECT_EQ(parser.parse("\t").type, CommandType::INVALID);

    // INVAILD: the commands should be written only in Upper-case (exept help command)
    EXPECT_EQ(parser.parse("get user1 prod1").type, CommandType::INVALID);
    EXPECT_EQ(parser.parse("help").type, CommandType::HELP);

    // VAILD: make sure parser is not treating a whitespace as a argument
    Command cmd2 = parser.parse("   PATCH    user123       prod1  prod2   ");
    
    EXPECT_EQ(cmd2.type, CommandType::ADD);
    
    ASSERT_EQ(cmd2.arguments.size(), 3); 
    EXPECT_EQ(cmd2.arguments[0], "user123");
    EXPECT_EQ(cmd2.arguments[1], "prod1");
    EXPECT_EQ(cmd2.arguments[2], "prod2");

    // VAILD: don't ignore special letters
    Command cmd = parser.parse("POST user!@# prod$%^");
    
    EXPECT_EQ(cmd.type, CommandType::ADD);
    ASSERT_EQ(cmd.arguments.size(), 2);
    EXPECT_EQ(cmd.arguments[0], "user!@#");
    EXPECT_EQ(cmd.arguments[1], "prod$%^");
}