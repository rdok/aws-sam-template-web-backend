const tableName = process.env.TABLE_NAME;
const dynamodb = require('aws-sdk/clients/dynamodb');
const endpoint = process.env.ENDPOINT_OVERRIDE;
const options = process.env.AWS_SAM_LOCAL ? { endpoint } : {};
const docClient = new dynamodb.DocumentClient(options);

exports.getByIdHandler = async ({pathParameters}) => {
  const {id} = pathParameters;
  const params = { TableName: tableName, Key: { id: id } };

  const data = await docClient.get(params).promise();
  const item = data.Item;

  return {
    statusCode: 200,
    body: JSON.stringify(item)
  };
}
