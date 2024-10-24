document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const searchModeButton = document.getElementById('search-mode-button');
    let currentSearchType = 'user'; // Default search type

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('search').value;

        // Clears previous results
        userList.textContent = '';
        reposList.textContent = '';

        if (currentSearchType === 'user') {
            // Search for users
            const users = await searchGitHubUsers(searchInput);
            displayUsers(users);
        } else {
            // Search for repositories
            const repos = await searchGitHubRepos(searchInput);
            displayRepos(repos);
        }
    });

    searchModeButton.addEventListener('click', () => {
        currentSearchType = currentSearchType === 'user' ? 'repo' : 'user';
        searchModeButton.textContent = `Switch to ${currentSearchType === 'user' ? 'Search Repositories' : 'Search Users'}`;
        userList.textContent = '';
        reposList.textContent = '';
    });

    async function searchGitHubUsers(query) {
        const response = await fetch(`https://api.github.com/search/users?q=${query}`);
        const data = await response.json();
        return data.items || [];
    }

    async function searchGitHubRepos(query) {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
        const data = await response.json();
        return data.items || [];
    }

    function displayUsers(users) {
        users.forEach(user => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = user.avatar_url;
            img.alt = `${user.login}'s avatar`;
            img.width = 50;
            img.height = 50;

            const link = document.createElement('a');
            link.href = '#';
            link.className = 'user-link';
            link.dataset.username = user.login;
            link.textContent = user.login;

            li.appendChild(img);
            li.appendChild(link);
            userList.appendChild(li);
        });

        // Attach click event to user links
        document.querySelectorAll('.user-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const username = e.target.dataset.username;
                fetchUserRepos(username);
            });
        });
    }

    async function fetchUserRepos(username) {
        reposList.textContent = ''; // Clear previous repos
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
        displayRepos(repos);
    }

    function displayRepos(repos) {
        repos.forEach(repo => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = repo.html_url;
            link.target = '_blank';
            link.textContent = repo.name;

            li.appendChild(link);
            li.append(` - ${repo.description || 'No description'}`);
            reposList.appendChild(li);
        });
    }
});
