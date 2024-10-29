const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

// In-memory storage for IP rate-limiting (resets on server restart)
const commonerRateLimit = {};

export default async (req, res) => {
    const { password, accessType, ip } = req.body;

    const commonerUrl = "https://raw.githubusercontent.com/DLindustries/database/main/commoner.txt";
    const premiumUrl = "https://raw.githubusercontent.com/DLindustries/database/main/premium.txt";
    const identifyUrl = "https://raw.githubusercontent.com/DLindustries/database/main/identify.txt";

    try {
        // Retrieve and check commoner webhook access
        if (accessType === 'commoner') {
            // Check rate limit by IP
            const now = Date.now();
            if (commonerRateLimit[ip] && now - commonerRateLimit[ip] < 10000) {
                return res.status(429).json({ error: "You have exceeded send limit. upgrade to premium or wait 10 seconds" });
            }
            commonerRateLimit[ip] = now;

            const commonerResponse = await fetch(commonerUrl);
            const commonerWebhook = (await commonerResponse.text()).trim();
            return res.status(200).json({ webhook: commonerWebhook });
        }

        // Retrieve and verify premium webhook access
        else if (accessType === 'premium') {
            const identifyResponse = await fetch(identifyUrl);
            const storedPassword = (await identifyResponse.text()).trim();

            if (password === storedPassword) {
                const premiumResponse = await fetch(premiumUrl);
                const premiumWebhook = (await premiumResponse.text()).trim();
                return res.status(200).json({ authorized: true, webhook: premiumWebhook });
            } else {
                return res.status(401).json({ authorized: false, error: "Incorrect password. Acess denied." });
            }
        } else {
            return res.status(400).json({ error: "Invalid access type." });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Server error: " + error.message });
    }
};
