import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { createTodos } from '../../datahelpers/todolayers'
//import * as AWS  from 'aws-sdk'
// import * as uuid from 'uuid'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE
const logger = createLogger('getTodos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Enter createTodo')
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  //const uniqueID = uuid.v4()

  const parsedUserId = getUserId(event)
  const newItem = await createTodos(parsedUserId, newTodo)

  // logger.info("parsedUserId = ", parsedUserId);

  // const newItem = {
  //   userId: parsedUserId,
  //   todoId: uniqueID,
  //   ...newTodo
  // }

  // await docClient.put({
  //   TableName: todosTable, 
  //   Item: newItem
  // }).promise()

  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
