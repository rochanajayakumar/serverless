import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { generateUploadUrl } from '../../datahelpers/todolayers'
import { updateUrl } from '../../datahelpers/todolayers'
// import * as AWS from 'aws-sdk'

// const todosBucket = process.env.TODOS_S3_BUCKET
// const todosTable = process.env.TODOS_TABLE
const logger = createLogger('generateUpload')
// const docClient = new AWS.DynamoDB.DocumentClient()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Enter generateUploadUrl")
  const todoId = event.pathParameters.todoId  
  const userId = getUserId(event)


  //const attachmentId = uuid.v4();
  const attachmentUrl = await generateUploadUrl(todoId)
  await updateUrl(attachmentUrl, todoId, userId)

  // logger.info(`Attachurl ${attachmentUrl}`)
  // await docClient.update({
  //   TableName: todosTable, 
  //   Key: {
  //     todoId: todoId, 
  //     userId: userId
  //   }, 
  //   UpdateExpression: 'set attachmentUrl = :attachmentUrl', 
  //   ExpressionAttributeValues: {
  //     ':attachmentUrl': attachmentUrl
  //   }
  // }).promise()



  // update attachment url 
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 200, 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }, 
    body: JSON.stringify({
      attachmentUrl
    })
  }
}


