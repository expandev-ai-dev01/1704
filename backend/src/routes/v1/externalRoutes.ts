import { Router } from 'express';
import { validationMiddleware } from '@/middleware/validationMiddleware';
import * as loginController from '@/api/v1/external/security/login/controller';
import { loginSchema } from '@/services/security/securityValidation';

const router = Router();

// --- FEATURE INTEGRATION POINT ---
// Add external (public) feature routes here.

// Security routes
router.post('/security/login', validationMiddleware(loginSchema), loginController.postHandler);

router.get('/ping', (_req, res) => {
  res.status(200).json({ message: 'pong from external v1' });
});

export default router;
