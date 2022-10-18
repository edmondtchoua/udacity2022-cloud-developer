 import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
 import { TodoItem } from '../models/TodoItem'
 import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
 import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()

export async function getAllTodosByUserId(userId:string): Promise<TodoItem[]> {
    return todosAccess.getAllTodosByUserId(userId)
  }

  export async function getTodosById(todoId:string): Promise<TodoItem> {
    return todosAccess.getTodosById(todoId)
  }
  export async function updateTodo(todo:TodoItem): Promise<TodoItem> {
    return todosAccess.updateTodo(todo)
  }
  export async function deleteTodo(todo:TodoItem){
       await todosAccess.deleteTodoById(todo)
  }
  export async function updateFullTodo(todo:TodoItem): Promise<TodoItem> {
    return todosAccess.updateFullTodo(todo)
  }
export function buildTodo(todoRequest : CreateTodoRequest,userId):TodoItem{
    const todo = {
        todoId :uuid.v4(),
        createdAt: new Date().toISOString(),
        userId: userId,
        done:false,
        attachmentUrl: '',
        ...todoRequest
    }
    return todo
}
