import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

//TODO: Implement the dataLayer logic
  export class TodosAccess {


    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly index = process.env.TODOS_CREATED_AT_INDEX,
      private readonly todosTable = process.env.TODOS_TABLE) {
    }
    async deleteTodoById(todo:TodoItem){
        logger.info('delete todos')
         await this.docClient.delete({
          TableName: this.todosTable,
          Key:{
            'todoId':todo.todoId,
            'userId': todo.userId
          }
        }).promise()
        logger.info('delete todos id ok')
        return null;
      }
    async updateTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info('udapte todo strarting ...')
        logger.debug(todo)
        await this.docClient.update({
          TableName: this.todosTable,
          Key: { 
            'todoId':todo.todoId,
            'userId': todo.userId
          },
          UpdateExpression: 'set attachmentUrl = :attachmentUrl',
          ExpressionAttributeValues: {
            ':attachmentUrl': todo.attachmentUrl
          },
          //ScanIndexForward: false
        }).promise()
      
        return todo
       
    }
    async updateFullTodo(todo: TodoItem): Promise<TodoItem> {
      logger.info('udapte full todo strarting ...')
      console.debug(todo)
      await this.docClient.update({
        TableName: this.todosTable,
        Key: { 
          'todoId':todo.todoId,
          'userId': todo.userId
        },
        UpdateExpression: 'set done = :done,#nme = :name,dueDate = :dueDate',
        ExpressionAttributeValues: {
          ':done' :todo.done,
          ':name':todo.name,
          ':dueDate':todo.dueDate
        },
        ExpressionAttributeNames:{
          "#nme": "name"
        }
        //ScanIndexForward: false
      }).promise()
    
      return todo
     
  }

    async getTodosById(todoId: string): Promise<TodoItem> {
        logger.info('Getting  todos by Id')
        const result = await this.docClient.query({
          TableName: this.todosTable,
          IndexName: this.index,
          KeyConditionExpression: 'todoId = :todoId',
          ExpressionAttributeValues: {
            ':todoId': todoId
          },
          //ScanIndexForward: false
        }).promise()
      
        return (result.Items.length!=0) ? result.Items[0] as TodoItem : null
       
      }

    async getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos by users')
        const result = await this.docClient.query({
          TableName: this.todosTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          //ScanIndexForward: false
        }).promise()
      
        return result.Items as TodoItem[]
      }


  
    async createTodo(todo: TodoItem): Promise<TodoItem> {
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()

      return todo
    }
  }

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }