import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
//import { TodosAccess } from '../../datalayers/todosAcess'
import { createTodo } from '../../businessLogic/todos'
 import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
 import { getUserId } from '../utils';
// import { createTodo } from '../../businessLogic/todos'

import { createLogger } from '../../utils/logger'


const logger = createLogger('Create')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    try{
      const userId = await getUserId(event);

    const todoCreated = await createTodo(newTodo,userId)
    console.log(event.body);
    return {
      statusCode: 201,
      headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item:todoCreated
      })
    }
    }catch(err){
      logger.error('Todo not createded', { error: err.message })
    }
    
  }
)

handler.use(
  cors({
    credentials: true
  })
)
