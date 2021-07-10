import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { deleteTodos } from '../../datahelpers/todolayers'

const logger = createLogger('deleteTodos')
// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Enter deleteTodo')
  const todoId = event.pathParameters.todoId; 
  const userId = getUserId(event)
  await deleteTodos(todoId, userId)

  // logger.info(`todoId = ${todoId} parsedUserId = ${userId}`)
  // const newItem = await docClient.query({
  //   TableName: todosTable,
  //   KeyConditionExpression: 'userId = :userId',
  //   ExpressionAttributeValues: {
  //     ':userId': userId
  //   }
  // }).promise()

  // const key = {
  //   userId: userId, 
  //   createdAt: newItem.Items[0].createdAt
  // }

  // logger.info(`Key = ${key}`)


  // await docClient.delete({
  //   TableName: todosTable,
  //   Key: {
  //     todoId, userId
  //   }
  // }).promise()

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }

  
}
