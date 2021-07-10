import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
// import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodos } from '../../datahelpers/todolayers';

const logger = createLogger('getTodos')
// const todosTable = process.env.TODOS_TABLE
// const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Enter updateToDo call")
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  // const authorization = event.headers.Authorization; 
  // const split = authorization.split(' ')
  // const token = split[1]
   const userId = getUserId(event)

  await updateTodos(todoId, userId, updatedTodo)

//  await docClient.update({
//    TableName: todosTable, 
//    Key: {
//      "todoId": todoId, 
//      "userId": userId
//    }, 
//    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done', 
//    ExpressionAttributeValues: {
//      ":name": updatedTodo.name,
//      ":dueDate": updatedTodo.dueDate,
//      ":done": updatedTodo.done
//    }
//  }).promise()

 return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: ''
  }

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

}
