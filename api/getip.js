const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/api/sendMessage', async (req, res) => {
    const { message } = req.body;

    try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ipAddress = ipResponse.data.ip;

        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();
        const fullMessage = `**NEW SUGGESTION:** ${message}\n\n*Sent on ${formattedDate} at ${formattedTime}*\n\n*IP Address: ${ipAddress}*`;

        const webhookUrl = 'https://discord.com/api/webhooks/1315628619225108562/D5kTXFozQeBABZhg9TrL_VKwRnX5RPUaYPbd1QfNmRQ4BaVTMY9qjLouQ7YWHux9q8F-';

        await axios.post(webhookUrl, { content: fullMessage });
        res.status(200).send('Message sent successfully');
    } catch (error) {
        res.status(500).send(`Error sending message: ${error.message}`);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
