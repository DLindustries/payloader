// File: /api/retrieveCommits.js

export default async function handler(req, res) {
    const repoOwner = 'DLindustries';
    const repoName = 'payloader';

    try {
        // Fetch commits from GitHub API
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("GitHub API error:", errorText);
            return res.status(response.status).json({ error: `GitHub API error: ${response.statusText}`, details: errorText });
        }

        // Get the commit data and limit to 10 commits
        const commits = await response.json();
        const recentCommits = commits.slice(0, 10).map(commit => ({
            message: commit.commit.message,
            date: commit.commit.committer.date
        }));

        res.status(200).json(recentCommits);
    } catch (error) {
        console.error("Error fetching commits:", error);
        res.status(500).json({ error: 'Failed to fetch commits', details: error.message });
    }
}
