import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => res.json({ success: true, data: [], message: 'Health events route OK' }));

export default router;