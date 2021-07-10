import 'source-map-support/register'

//import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const todosBucket = process.env.TODOS_S3_BUCKET
const logger = createLogger('TodosLayer')

export async function createTodos(parsedUserId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

  const uniqueID = uuid.v4()
  logger.info(`Creating todo id: ${uniqueID} for user id: ${parsedUserId}`)

  const newItem : TodoItem = {
    userId: parsedUserId, 
    todoId: uniqueID,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null, 
    ...createTodoRequest
  }

  logger.info(`Add new item: ${newItem} to table ${todosTable}`)

  await docClient.put({
    TableName: todosTable, 
    Item: newItem
  }).promise()

  return newItem
}

export async function deleteTodos(todoId: string, userId: string) {

  await docClient.delete({
    TableName: todosTable,
    Key: {
      todoId, userId
    }
  }).promise()
}

export async function updateTodos(todoId: string, userId: string, updatedTodo: UpdateTodoRequest) {
  
  await docClient.update({
   TableName: todosTable, 
   Key: {
    todoId, userId
   }, 
   UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done', 
   ExpressionAttributeValues: {
     ":name": updatedTodo.name,
     ":dueDate": updatedTodo.dueDate,
     ":done": updatedTodo.done
   }
 }).promise()
}

export async function getTodos(userId: string) : Promise<TodoItem[]> {
    // TODO: Get all TODO items for a current user

 logger.info(" user id = ", userId)

 const newItem = await docClient.query({
   TableName: todosTable,
   KeyConditionExpression: 'userId = :userId',
   ExpressionAttributeValues: {
     ':userId': userId
   }
 }).promise()

 const result = newItem.Items

 return result as TodoItem[]
}

export async function generateUploadUrl(id: string) :Promise<string> {
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

  const attachmentUrl = s3.getSignedUrl('putObject',{
    Bucket: todosBucket, 
    Key: id,
    Expires: '30000'
  })
  logger.info(`Signed Url: ${attachmentUrl}`)
  return attachmentUrl
}

export async function updateUrl(attachmentUrl: string, todoId: string ,userId: string) {
  await docClient.update({
    TableName: todosTable, 
    Key: {
      todoId: todoId, 
      userId: userId
    }, 
    UpdateExpression: 'set attachmentUrl = :attachmentUrl', 
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  }).promise()
}


