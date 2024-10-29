const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { password, accessType } = req.body;

    const commonerUrl = "https://raw.githubusercontent.com/DLindustries/database/main/commoner.txt";
    const premiumUrl = "https://raw.githubusercontent.com/DLindustries/database/main/premium.txt";
    const identifyUrl = "https://raw.githubusercontent.com/DLindustries/database/main/identify.txt";

    // Function to check internet connection
    const isConnectedToInternet = async () => {
        try {
            const response = await fetch('https://www.google.com', { method: 'HEAD' });
            return response.ok; // If we get a response, we're connected
        } catch (error) {
            return false; // If there's an error, we're likely not connected
        }
    };

    try {
        // Check for internet connection
        const isConnected = await isConnectedToInternet();
        if (!isConnected) {
            return res.status(503).json({ error: "Cannot connect to service api: Are you connected to the internet?" });
        }

        if (accessType === 'commoner') {
            const commonerResponse = await fetch(commonerUrl);
            const commonerWebhook = (await commonerResponse.text()).trim();
            res.status(200).json({ webhook: commonerWebhook });
        } else if (accessType === 'premium') {
            const identifyResponse = await fetch(identifyUrl);
            const storedPassword = (await identifyResponse.text()).trim();

            if (password === storedPassword) {
                const premiumResponse = await fetch(premiumUrl);
                const premiumWebhook = (await premiumResponse.text()).trim();
                res.status(200).json({ authorized: true, webhook: premiumWebhook });
            } else {
                res.status(401).json({ authorized: false, error: "Incorrect password." });
            }
        } else {
            res.status(400).json({ error: "Invalid access type." });
        }
    } catch (error) {
        console.error("Error fetching data: either our service has been terminated or attacked", error);
        res.status(500).json({ error: "Server error contact devs and state your circumstances" });
    }
};
