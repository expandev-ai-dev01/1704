import { Router } from 'express';

const router = Router();

// --- FEATURE INTEGRATION POINT ---
// Add external (public) feature routes here.
// Example:
// import authRoutes from '@/api/v1/external/auth/routes';
// router.use('/auth', authRoutes);

router.get('/ping', (_req, res) => {
  res.status(200).json({ message: 'pong from external v1' });
});

export default router;
