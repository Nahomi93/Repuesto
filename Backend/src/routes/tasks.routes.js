import {Router} from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import { getTasks, getTask, createTask, updateTask, deleteTask, updateTaskStatus, getTaskPorCliente  } from '../controllers/tasks.controller.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { createTaskSchema, updateTaskStatusSchema } from '../schemas/task.shema.js'
const router = Router()


router.get('/tasks', authRequired,getTasks);
router.get('/tasks/:id', authRequired,getTask);
router.post('/tasks', authRequired, validateSchema(createTaskSchema),createTask);
router.delete('/tasks/:id', authRequired,deleteTask);
router.put('/tasks/:id', authRequired,updateTask);
router.put('/tasks/:id/status', authRequired, validateSchema(updateTaskStatusSchema), updateTaskStatus);
router.get('/tasks/por-cliente', authRequired, getTaskPorCliente); 

export default router;