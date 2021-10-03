/* eslint linebreak-style: ["error", "windows"] */

/** Takes int seconds and returns converted minutes or hours */
const calculateTime = (seconds) => {
  const minutesMsg = ' minutes ago'
  const secsSinceNow = Math.floor(Date.now() / 1000) - seconds;
  let returnVal = undefined;
  
  if (secsSinceNow < 60) returnVal =  1 + minutesMsg;
  else if (secsSinceNow < 3600) returnVal =  Math.floor(secsSinceNow / 60) + minutesMsg;
  
  return returnVal;
}

/** Takes a Story object 'story' and returns a DOM span element 'sub' that contains data on subline of story  */
const storySubBuilder = (story) => {
  const sub = document.createElement('span');
  
  pScore = document.createElement('p');
  pScore.innerHTML = story.score + ' points by ';
  
  pUser = document.createElement('p');
  pUser.innerHTML = story.by;
  
  pTime = document.createElement('a');
  pTime.setAttribute('href', '#' + story.id);
  if (story.time) {
    pTime.innerHTML = calculateTime(story.time);
  }
  sub.appendChild(pScore);
  sub.appendChild(pUser);
  sub.appendChild(pTime);
  
  return sub;
};

/** Takes a Story object 'story' and an int 'index' value and returns a DOM span element 'main' containing mainline data from story  */
const storyMainBuilder = (story, index) => {
  const main = document.createElement('span');
  main.setAttribute('class', 'post-story');
  
  pIndex = document.createElement('p');
  pIndex.setAttribute('class', 'index');
  pIndex.innerHTML = index;
  
  pUpvote = document.createElement('button');
  pUpvote.innerHTML = '^';
  
  pTitle = document.createElement('a');
  pTitle.href = story.url;
  pTitle.innerHTML = story.title;
  
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

/** Takes Story object 'story' and int 'index' and returns a DOM div element 'story' containing a main and subline of story data */
const storyElementBuilder = (story, index) => {
  const storyElement = document.createElement('div');

  storyElement.appendChild(storyMainBuilder(story, index));
  storyElement.appendChild(storySubBuilder(story));

  return storyElement;
};

/** Takes an array of Story objects 'storyArray' and returns a page container populated with 'story' elements */
const buildPage = (storyArray) => {
  container = document.getElementById('posts');
  container.innerHTML = '';
  
  for (let i = 0; i < storyArray.length; ++i) {
    // Create a story div for each story
    container.appendChild(storyElementBuilder(storyArray[i], i + 1));
  }
  
  return container;
};

/** Async returns promised Story JSON object of an item ID from HN Firebase API
 * Helper function for buildStoryArray()
 */
const fetchStoryJSON = async (itemID) => {
  url = 'https://hacker-news.firebaseio.com/v0/item/' + itemID + '.json?';
  const response = await fetch(url);
  
  if (response.ok) return response.json();

  else return;
};

/** Takes a JSON object of a page view from HN Firebase API and returns an array of Story objects from each story's JSON */
const buildStoryArray = (JSON) => {
  const promiseArray = [];
  for (i = 0; i < 30; ++i) {
    promiseArray.push(fetchStoryJSON(JSON[i]));
  }
  return Promise.all(promiseArray);
};

/** Takes a page link, gets a page view JSON object using fetch, builds an array of Story objects with buildStoryArray(), then builds a filled page container from array of Story objects using buildPage() */
const loadPage = (pageLink) => {
  // Create full url to request from hacker-news api
  url = 'https://hacker-news.firebaseio.com/v0' + pageLink + '.json?';
  // console.log(url);
  fetch(url)
      .then((response) => response.json())
      .then((JSON) => buildStoryArray(JSON))
      .then((storyArray) => buildPage(storyArray));
};

const loadPost = (postID) => {
  fetchStoryJSON(postID)
      .then((JSON) => {
        console.log(JSON);
      });
}

/** Callback function for onhashchange event
 * Loads page given by location.hash
 */
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
    case '#home': {
      loadPage('/topstories');
      break;
    }
    default: {
      console.log(location.hash.slice(1, location.hash.length - 1));
      loadPost(location.hash.slice(1, location.hash.length - 1));
    }
  }
};
container = document.getElementById('posts');

locationHashChanged()

console.log('Hello, World!');

window.onhashchange = locationHashChanged;
