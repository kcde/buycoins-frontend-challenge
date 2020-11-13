import { config } from './config.js';
import { months } from './months.js';

const getGitDetails = async () => {
    try {
        const req = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + config.a + config.b,
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
        repositories(last: 21) {
            totalCount
          nodes {
            url
            isPrivate
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
        return details;
    } catch (error) {
        console.error(error);
    }
};

const dateRender = (date) => {
    let fullDate = date.split('T').slice(0, 1).join();
    let fullDateArr = fullDate.split('-');
    let month = fullDateArr[1];
    let day = fullDateArr[2] < 10 ? fullDateArr[2].split(0).join('') : fullDateArr[2];
    return `${day} ${months[month - 1]['abbreviation']}`;
};

const repoGenerator = (arr) => {
    let arrFilter = arr.filter((repo) => repo.isPrivate !== true);
    arrFilter.forEach((repo) => {
        repoContainer.innerHTML += `<div class="repo">
      <div class="repo-left split">
          <a href= ${repo.url} class="repo-name">${repo.name}</a>
          <p class="repo-desc">${repo.description === null ? ' ' : repo.description}</p>
          <div class="repo-info">
              <div class="main-language flex ai-c">
                  <i class="fas fa-circle language-color  icon" style="color:${
                      repo.primaryLanguage === null ? '' : repo.primaryLanguage.color
                  }"></i>
                  <p class="language">${
                      repo.primaryLanguage === null ? '' : repo.primaryLanguage.name
                  }</p>
              </div>
              <div class="repo-star flex ai-c">
                  <i class="far fa-star icon"></i>
                  <p class="star-count">${repo.stargazerCount}</p>
              </div>

              <div class="repo-fork flex ai-c">
                  <i class="fas fa-code-branch icon"></i>
                  <p class="fork-count">${repo.forkCount}</p>
              </div>

              <p class="repo-update"> Updated on ${dateRender(repo.updatedAt)}</p>
          </div>
      </div>

      <div class="repo-right">
          <div class="star-repo flex ai-c">
              <i class="far fa-star icon"></i>
              <p>Star</p>
          </div>
      </div>
  </div>`;
    });
};

const repoContainer = document.querySelector('.repo-container');
const repoCount = document.querySelector('.repo-count');
const navImg = document.querySelector('.nav-photo-img');
const userImg = document.querySelector('.user-photo-img');
const bioMessage = document.querySelector('.bio-message');
const fullName = document.querySelector('.full-name');
const username = document.querySelector('.username');

const repoRender = async () => {
    const repoInfo = await getGitDetails();
    repoCount.textContent = await repoInfo.repositories.totalCount;
    const repoList = await repoInfo.repositories.nodes.reverse();
    repoGenerator(repoList);
};

const photoRender = async () => {
    const repoInfo = await getGitDetails();
    let photoSrc = repoInfo.avatarUrl;
    navImg.src = photoSrc;
    userImg.src = photoSrc;
};

const nameBioRender = async () => {
    const repoInfo = await getGitDetails();
    fullName.textContent = repoInfo.name;
    username.textContent = repoInfo.login;
    bioMessage.textContent = repoInfo.bio;
};
repoRender();
photoRender();
nameBioRender();
