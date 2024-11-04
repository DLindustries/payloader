// File: /api/retrieveCommits.js

export default async function handler(req, res) {
    const repoOwner = 'DLindustries';
    const repoName = 'payloader';

    try {
        // Fetch commits from GitHub API for a public repository (no token required)
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("updates fetch error:", errorText);
            return res.status(response.status).json({ error: `GitHub API error: ${response.statusText}`, details: errorText });
        }

        const commits = await response.json();
        res.status(200).json(commits);
    } catch (error) {
        console.error("Error fetching commits:", error);
        res.status(500).json({ error: 'Failed to fetch commits', details: error.message });
    }
}
