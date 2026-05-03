#include <gtest/gtest.h>
#include <string>
#include <vector>
#include "../src/StringParser.h"
#include "../src/Command.h"

// Add comand
TEST(ParserTest, ValidateAddCommandSyntax) {
    StringParser parser;
    
    // Valid: user and at least one product
    Command valid = parser.parse("add user123 prod1");
    EXPECT_EQ(valid.type, CommandType::ADD);
    EXPECT_EQ(valid.arguments.size(), 2);

    // Valid:  add, user and 10 products
    Command cmd1 = parser.parse("add u1 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10");
    EXPECT_EQ(cmd1.type, CommandType::ADD);
    EXPECT_EQ(cmd1.arguments.size(), 11);

    // Invalid: only "add" command, or "add" and user
    EXPECT_EQ(parser.parse("add user123").type, CommandType::INVALID);
    EXPECT_EQ(parser.parse("add").type, CommandType::INVALID);
}

// Recommend command
TEST(ParserTest, ValidateRecommendCommandSyntax) {
    StringParser parser;
    
    // Valid: two arguments after the "recommend" command
    Command valid = parser.parse("recommend user123 prod456");
    EXPECT_EQ(valid.type, CommandType::RECOMMEND);
    ASSERT_EQ(valid.arguments.size(), 2);

    // Invalid: only command, or command and only user
    EXPECT_EQ(parser.parse("recommend").type, CommandType::INVALID);
    EXPECT_EQ(parser.parse("recommend user123").type, CommandType::INVALID);

    // Invalid: more then 2 arguments
    EXPECT_EQ(parser.parse("recommend u1 p1 extra").type, CommandType::INVALID);
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
}

// Handle whitespaces, tabs and invalid input
TEST(ParserTest, FlagsInvalidCommands) {
    StringParser parser;
    
    // INVAILD: wrong command type
    EXPECT_EQ(parser.parse("delete user123").type, CommandType::INVALID);
    
    // INVAILD: empty string
    EXPECT_EQ(parser.parse("   ").type, CommandType::INVALID);
    
    // INVAILD: using tabs between words is not replacing whitespace 
    EXPECT_EQ(parser.parse("add\tuser1\tprod1").type, CommandType::INVALID);

    // INVALID: just a tab string
    EXPECT_EQ(parser.parse("\t").type, CommandType::INVALID);

    // INVAILD: the commands should be written only in lower-case
    EXPECT_EQ(parser.parse("ADD user1 prod1").type, CommandType::INVALID);

    // VAILD: make sure parser is not treating a whitespace as a argument
    Command cmd2 = parser.parse("   add    user123       prod1  prod2   ");
    
    EXPECT_EQ(cmd2.type, CommandType::ADD);
    
    ASSERT_EQ(cmd2.arguments.size(), 3); 
    EXPECT_EQ(cmd2.arguments[0], "user123");
    EXPECT_EQ(cmd2.arguments[1], "prod1");
    EXPECT_EQ(cmd2.arguments[2], "prod2");

    // VAILD: don't ignore special letters
    Command cmd = parser.parse("add user!@# prod$%^");
    
    EXPECT_EQ(cmd.type, CommandType::ADD);
    ASSERT_EQ(cmd.arguments.size(), 2);
    EXPECT_EQ(cmd.arguments[0], "user!@#");
    EXPECT_EQ(cmd.arguments[1], "prod$%^");
}