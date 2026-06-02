// Import server's implement
const tcpClient = require('../utils/tcpClient');

// Write format for each command we want to send to the CPP server
const sendGetCommand = (userId, productId) => {
    const command = `GET ${userId} ${productId}`;
    tcpClient.sendTelemetry(command);
};

const sendPostCommand = (userId, productsIdArray) => {
    const command = `POST ${userId} ${productsIdArray.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

const sendPatchCommand = (userId, productsIdArray) => {
    const command = `PATCH ${userId} ${productsIdArray.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

const sendDeleteCommand = (userId, productsIdArray) => {
    const command = `DELETE ${userId} ${productsIdArray.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

module.exports = {
    sendGetCommand,
    sendPostCommand,
    sendPatchCommand,
    sendDeleteCommand
};