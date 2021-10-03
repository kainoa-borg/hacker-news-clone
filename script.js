/* eslint linebreak-style: ["error", "windows"]*/

const postSubBuilder = (post) => {
  const sub = document.createElement('span');
  pScore = document.createElement('p');
  pScore.innerHTML = post.score + ' points by ';
  pUser = document.createElement('p');
  pUser.innerHTML = post.by;
  sub.appendChild(pScore);
  sub.appendChild(pUser);
  return sub;
};

const postMainBuilder = (post, index) => {
  const main = document.createElement('span');
  main.setAttribute('class', 'post-story');
  pIndex = document.createElement('p');
  pIndex.setAttribute('class', 'index');
  pIndex.innerHTML = index;
  pUpvote = document.createElement('button');
  pUpvote.innerHTML = '^';
  pTitle = document.createElement('a');
  pTitle.href = post.url;
  pTitle.innerHTML = post.title;
  pDomain = document.createElement('p');
  pDomain.setAttribute('class', 'domain');
  pDomain.innerHTML = '(' + pTitle.hostname + ')';
  main.appendChild(pIndex);
  main.appendChild(pUpvote);
  main.appendChild(pTitle);
  main.appendChild(pDomain);
  main.setAttribute('class', 'post-story');
  return main;
};

const postElementBuilder = (post, index) => {
  const story = document.createElement('div');

  story.append(postMainBuilder(post, index));
  story.append(postSubBuilder(post));

  return story;
};

const buildPage = (storyArray) => {
  console.log(storyArray);
  container = document.getElementById('posts');
  container.innerHTML = '';
  for (let i = 0; i < storyArray.length; ++i) {
    // Create a story div for each story
    container.appendChild(postElementBuilder(storyArray[i], i + 1));
  }
  return container;
};

const fetchStoryJSON = async (pageLink) => {
  url = 'https://hacker-news.firebaseio.com/v0/item/' + pageLink + '.json?';
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
};

const buildStoryArray = (JSON) => {
  const promiseArray = [];
  for (i = 0; i < 30; ++i) {
    promiseArray.push(fetchStoryJSON(JSON[i]));
  }
  return Promise.all(promiseArray);
};

const loadPage = (pageLink) => {
  // Create full url to request from hacker-news api
  url = 'https://hacker-news.firebaseio.com/v0' + pageLink + '.json?';
  // console.log(url);
  fetch(url)
      .then((response) => response.json())
      .then((JSON) => buildStoryArray(JSON))
      .then((storyArray) => buildPage(storyArray));
};

const locationHashChanged = () => {
  switch (location.hash) {
    case '#best': {
      loadPage('/beststories');
      break;
    }
    case '#newest': {
      loadPage('/newstories');
      break;
    }
    case '#JSONdump': {
      loadPage('/item/3000');
      break;
    }
    case '#home': {
      loadPage('/topstories');
    }
  }
};

console.log('Hello, World!');

loadPage('/topstories');
window.onhashchange = locationHashChanged;
