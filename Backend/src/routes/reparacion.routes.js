import {Router} from 'express'
import { authRequired } from '../middlewares/validateToken.js'
import { getReparaciones, getReparacion, createReparacion, updateReparacion, deleteReparacion, upload, calificacionReparacion,getReparacionesCliente,deleteReparacionFoto } from '../controllers/reparacion.controller.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { createReparacionSchema } from '../schemas/reparacion.schema.js'
const router = Router()

router.get('/reparaciones', authRequired,getReparaciones);
router.get('/reparaciones/cliente/:id', authRequired,getReparacionesCliente);
router.get('/reparaciones/:id', authRequired,getReparacion);
router.post('/reparaciones',upload, authRequired, validateSchema(createReparacionSchema),createReparacion);
router.delete('/reparaciones/:id', authRequired,deleteReparacion);
router.put('/reparaciones/:id', upload,authRequired,updateReparacion);
router.patch('/reparaciones/:id', authRequired,calificacionReparacion);
router.delete('/reparaciones/:id/foto', authRequired, deleteReparacionFoto);


export default router;