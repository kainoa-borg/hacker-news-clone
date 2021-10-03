/* eslint linebreak-style: ["error", "windows"]*/

/** Represents a parent class for all DOM element types */

const handleJSON = (JSON) => {
  return JSON;
};

const fetchPageJSON = async (pageLink) => {
  // Create full url to request from hacker-news api
  url = 'https://hacker-news.firebaseio.com/v0' + pageLink + '.json?';
  // console.log(url);
  const response = await fetch(url);
  if (response.ok) {
    return await response.json();
  }
};

const buildPage = (storyArray) => {
  container = document.getElementById('posts');
  for (let i = 0; i < storyArray.length; ++i) {
    // Create a story div for each story
    storyDiv = document.createElement('div');
    container.appendChild(storyDiv);
    storyTitle = document.createElement('p');
    storyDiv.appendChild(storyTitle);
    storyTitle.innerHTML = storyArray[i].title;
  }
  return container;
};

const buildStoryArray = async (JSON) => {
  const storyArray = [];
  for (let i = 0; i < 30; ++i) {
    const story = await fetchPageJSON('/item/' + JSON[i]);
    if (story) {
      // console.log(story);
      storyArray.push(story);
    }
  }

  return storyArray;
};

const loadPage = (pageID) => {
  fetchPageJSON(pageID)
      .then((value) => {
        return buildStoryArray(value);
      })
      .then((value) => {
        return buildPage(value);
      });
};

const locationHashChanged = () => {
  switch (location.hash) {
    case '#news': {
      loadPage('/topstories');
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
    default: {
      fetchPageJSON('/topstories')
          .then((value) => handleJSON(value));
    }
  }
};

console.log('Hello, World!');

loadPage('/topstories');
window.onhashchange = locationHashChanged;
