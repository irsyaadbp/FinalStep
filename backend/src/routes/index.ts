import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

router.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

export default router;
