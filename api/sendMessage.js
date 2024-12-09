import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { message } = req.body;

    try {
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();
        const fullMessage = `**NEW SUGGESTION:** ${message}\n\n*Sent on ${formattedDate} at ${formattedTime}*`;

        const webhookUrl = 'https://discord.com/api/webhooks/1315628619225108562/D5kTXFozQeBABZhg9TrL_VKwRnX5RPUaYPbd1QfNmRQ4BaVTMY9qjLouQ7YWHux9q8F-';

        await axios.post(webhookUrl, { content: fullMessage });
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ error: `Error sending message: ${error.message}` });
    }
}
