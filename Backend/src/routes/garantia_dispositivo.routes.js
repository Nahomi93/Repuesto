import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { getGarantias, getGarantia, createGarantia, updateGarantia, deleteGarantia, importGarantiasFromCSV } from '../controllers/garantia_dispositivo.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { createGarantia_dispositivoSchema } from '../schemas/garantia_dispositivo.schema.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });  // Almacenar archivos temporalmente

router.get('/garantia', authRequired, getGarantias);
router.get('/garantia/:id', authRequired, getGarantia);
router.post('/garantia', authRequired, validateSchema(createGarantia_dispositivoSchema), createGarantia);
router.delete('/garantia/:id', authRequired, deleteGarantia);
router.put('/garantia/:id', authRequired, updateGarantia);

router.post('/garantia/import/csv', authRequired, upload.single('file'), importGarantiasFromCSV);

export default router;
