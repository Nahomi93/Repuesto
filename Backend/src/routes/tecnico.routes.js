import {Router} from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import { getTecnicos, getTecnico, updateTecnico, deleteTecnico } from '../controllers/tecnico.controller.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { createTecnicoSchema } from '../schemas/tecnico.schema.js'
const router = Router()

router.get('/tecnicos', authRequired,getTecnicos);
router.get('/tecnicos/:id', authRequired,getTecnico);
router.delete('/tecnicos/:id', authRequired,deleteTecnico);
router.put('/tecnicos/:id', authRequired,updateTecnico);


export default router;