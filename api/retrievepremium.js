import fetch from 'node-fetch';


module.exports = async (req, res) => {
    const { password, accessType } = req.body;

    const commonerUrl = "https://raw.githubusercontent.com/DLindustries/database/main/commoner.txt";
    const premiumUrl = "https://raw.githubusercontent.com/DLindustries/database/main/premium.txt";
    const identifyUrl = "https://raw.githubusercontent.com/DLindustries/database/main/identify.txt";

    const isConnectedToInternet = async () => {
        try {
            const response = await fetch('https://www.google.com', { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error("Internet connection error:", error);
            return false;
        }
    };

    try {
        const isConnected = await isConnectedToInternet();
        if (!isConnected) {
            return res.status(503).json({ error: "Service Unavailable: Are you connected to the internet?" });
        }

        if (accessType === 'commoner') {
            const commonerResponse = await fetch(commonerUrl);
            if (!commonerResponse.ok) {
                throw new Error(`Failed to fetch commoner webhook: ${commonerResponse.statusText}`);
            }
            const commonerWebhook = (await commonerResponse.text()).trim();
            return res.status(200).json({ webhook: commonerWebhook });
        } else if (accessType === 'premium') {
            const identifyResponse = await fetch(identifyUrl);
            if (!identifyResponse.ok) {
                throw new Error(`Failed to fetch identify file: ${identifyResponse.statusText}`);
            }
            const storedPassword = (await identifyResponse.text()).trim();

            if (password === storedPassword) {
                const premiumResponse = await fetch(premiumUrl);
                if (!premiumResponse.ok) {
                    throw new Error(`Failed to fetch premium webhook: ${premiumResponse.statusText}`);
                }
                const premiumWebhook = (await premiumResponse.text()).trim();
                return res.status(200).json({ authorized: true, webhook: premiumWebhook });
            } else {
                return res.status(401).json({ authorized: false, error: "Incorrect password." });
            }
        } else {
            return res.status(400).json({ error: "Invalid access type." });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Server error: " + error.message });
    }
};
