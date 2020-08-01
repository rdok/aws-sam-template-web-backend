const tableName = process.env.TABLE_NAME;

const dynamodb = require('aws-sdk/clients/dynamodb');
const endpoint = process.env.ENDPOINT_OVERRIDE;
const options = process.env.AWS_SAM_LOCAL ? { endpoint } : {};
const docClient = new dynamodb.DocumentClient(options);

exports.getAllItemsHandler = async (event) => {

    let params = { TableName: tableName };

    const data = await docClient.scan(params).promise();

    const items = data.Items;

    return {
        statusCode: 200,
        body: JSON.stringify(items)
    };
}
