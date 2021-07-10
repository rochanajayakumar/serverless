import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
//import { todolayers } from '../../businesslogic/todolayers'
import { getUserId } from '../utils';
import { getTodos } from '../../datahelpers/todolayers'

// import * as AWS  from 'aws-sdk'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE
const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)
  const result = await getTodos(userId)
  
  logger.info(" user id = ", userId)

  // const newItem = await docClient.query({
  //   TableName: todosTable,
  //   KeyConditionExpression: 'userId = :userId',
  //   ExpressionAttributeValues: {
  //     ':userId': userId
  //   }
  // }).promise()

  // const result = newItem.Items

  return {
    statusCode: 200, 
    headers: {
      'Access-Control-Allow-Origin': '*'
    }, 
    body: JSON.stringify({
      items: result
    })
  }

}

