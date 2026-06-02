// Import server's implement
const tcpClient = require('../utils/tcpClient');

// Write format for each command we want to send to the CPP server
const sendGetCommand = (userId, productId) => {
    const command = `GET ${userId} ${productId}`;
    tcpClient.sendTelemetry(command);
};

const sendPostCommand = (userId, orderId, productsIdArray) => {
    const command = `POST ${userId} ${orderId} ${productsIdArray.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

const sendPatchCommand = (userId, orderId, productsIdArray) => {
    const command = `PATCH ${userId} ${orderId} ${productsIdArray.join(' ')}`;
    tcpClient.sendTelemetry(command);
};

const sendDeleteCommand = (userId, orderId) => {
    const command = `DELETE ${userId} ${orderId}`;
    tcpClient.sendTelemetry(command);
};

module.exports = {
    sendGetCommand,
    sendPostCommand,
    sendPatchCommand,
    sendDeleteCommand
};