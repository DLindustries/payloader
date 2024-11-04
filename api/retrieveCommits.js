// File: /api/retrieveCommits.js

export default async function handler(req, res) {
    const repoOwner = 'DLindustries';
    const repoName = 'payloader';
    const githubToken = process.env.GITHUB_TOKEN; // Use GitHub token for authentication

    try {
        // Fetch commits from GitHub API
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const commits = await response.json();
        res.status(200).json(commits);
    } catch (error) {
        console.error("Error fetching commits:", error);
        res.status(500).json({ error: 'Failed to fetch commits' });
    }
}
