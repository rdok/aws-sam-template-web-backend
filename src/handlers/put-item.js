const dynamodb = require('aws-sdk/clients/dynamodb');
const endpoint = process.env.ENDPOINT_OVERRIDE;
const options = process.env.AWS_SAM_LOCAL ? { endpoint } : {};
const docClient = new dynamodb.DocumentClient(options);

const tableName = process.env.TABLE_NAME;

exports.putItemHandler = async (event) => {
    const body = JSON.parse(event.body)
    const id = body.id;
    const name = body.name;

    var params = {
        TableName: tableName,
        Item: { id: id, name: name }
    };

    await docClient.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(body)
    };
};