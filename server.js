import express from 'express';
import dotenv from 'dotenv';
import { handleGeneratePost } from './ContextsController.js';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/generate-post', (req, res) => {
    const clientToken = req.query.token;
    const serverToken = process.env.CRON_SECRET;

    if (!clientToken || clientToken !== serverToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    return handleGeneratePost(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});