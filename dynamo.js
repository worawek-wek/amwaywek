const AWS = require('aws-sdk');
require('dotenv').config({ path: '.env.env' })
// require('dotenv').config(); //1.2k (gzipped: 705);
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "harrypotter-api";

const getCharacters = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    const character = await dynamoClient.scan(params).promise();
    console.log(character);
    return character;
};

const addOrUpdateCharacter = async (character) => {
    const params = {
        TableName: TABLE_NAME,
        Item: character
    };
    return await dynamoClient.put(params).promise();
}
getCharacters();
const da = {
    id:"123",
    hest:"1231"
}
// addOrUpdateCharacter(da);
module.exports = {
    dynamoClient,
    getCharacters,
}