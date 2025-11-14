import { Router } from 'express';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = Router();

// All internal routes are protected by the authentication middleware
router.use(authMiddleware);

// --- FEATURE INTEGRATION POINT ---
// Add internal (authenticated) feature routes here.
// Example:
// import userRoutes from '@/api/v1/internal/users/routes';
// router.use('/users', userRoutes);

router.get('/ping', (_req, res) => {
  res.status(200).json({ message: 'pong from internal v1' });
});

export default router;
