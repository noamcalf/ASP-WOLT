#include "PatchCommand.h"
#include <iostream>

using namespace std;

// Represents "POST" command
// Execute
string PatchCommand::execute() {
    // Call "father"'s class execute()
    AddCommand::execute(); 
    
    // Return the wanted output - not the same as Add's
    return "204 No Content"; 
}

string PatchCommand::getSignature() const {
    return "PATCH, arguments: [userid] [productid1] [productid2] ...";
}