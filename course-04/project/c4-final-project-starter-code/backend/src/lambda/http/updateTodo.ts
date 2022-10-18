import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodosById,updateFullTodo} from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
//import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


const logger = createLogger('Update')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
      const todoId = event.pathParameters.todoId
        const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
        // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
        const todo = await getTodosById(todoId)
        console.debug(todo)
        todo.done = updatedTodo.done ?? false
        todo.name = updatedTodo.name ?? ''
        todo.dueDate = updatedTodo.dueDate ?? ''
        await updateFullTodo(todo);
        return {
                statusCode: 200,
                headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({
                    todo
                })
        }
        
    }catch(err){
      logger.error('Todo not createded', { error: err.message })
    }
        

    }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
