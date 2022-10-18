import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo,getTodosById } from '../../helpers/todos'
//import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


const logger = createLogger('Delete')
        

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
        const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
        const todo = await getTodosById(todoId)
      
        await deleteTodo(todo)
      
        return null      
    
    }catch(err){
      logger.error('Todo not deleted', { error: err.message })
    }
    
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
