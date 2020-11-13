import { config } from './config.js';
const getGitDetails = async () => {
    try {
        const req = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: config.api,
            },
            body: JSON.stringify({
                query: `
                query

    {
      viewer {
        name
        login
        bio
        avatarUrl
        repositories(last: 20) {
            totalCount
          nodes {
            name
            description
            primaryLanguage {
              color
              name
            }
            updatedAt
            forkCount
            stargazerCount
          }

        }
      }
    }
                `,
            }),
        });
        const res = await req.json();
        const details = res.data.viewer;
        console.log(details);
        return details;
    } catch (error) {
        console.error(error);
    }
};

getGitDetails();
