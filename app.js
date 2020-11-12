const getGitDetails = async () => {
    const req = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 8ab67862d5440f75e7ae8d27397a345d48ac6291`,
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
      nodes {
        name
        description
        primaryLanguage {
          color
          name
        }
        updatedAt

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
};

getGitDetails();
