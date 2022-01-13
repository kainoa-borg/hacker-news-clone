function json_listener(obj) {
    obj = [...JSON.parse(this.responseText)];
}

function handle_json(xhttp) {
    let post_array = [...JSON.parse(xhttp.responseText)];
    container.innerHTML = "";
    fill_posts
}

function get_request(url_target, container, handler_func) {
    let url = "https://node-hnapi.herokuapp.com" + url_target;

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let post_array = handle_json(this);
            console.log(post_array);
            container.innerHTML = "";
            handler_func(post_array, container);
        }
    };

    xhttp.open("GET", url, false);
    xhttp.send();
}


/**
 * Create an element and append to container
 * @param {Element} container Container element to append child to
 * @param {String} elementType Desired type of element to append to container
 * @returns {Element} Original container element with appended child
 */
function build_element(container, elementType) {
    return container.appendChild(document.createElement(elementType));
}

/**
 * Create an element with a specified attribute
 * @param {Element} container Container element to append child to
 * @param {String} elementType Desired type of element to append to container
 * @param {String} desired_attribute Desired attribute type to apply to new element
 * @param {String} desired_value Desired value of new attribute to apply to new element
 * @returns {Element} Container element with appended child element
 */
function build_element(container, elementType, desired_attribute, desired_value) {
    temp = container.appendChild(document.createElement(elementType));
    temp.setAttribute(desired_attribute, desired_value);
    return temp;
}

/**
 * Fill specified container with posts from HN api
 * @param {Object[]} post_array array of post objects parsed from JSON 
 * @param {String} containerID ID of main container to append with posts
 * @returns {Element[]} Array of post elements currently on the DOM;
 */
function fill_posts(post_array, container) {

    let post_elements = [post_array.length];

    for (i = 0; i < post_array.length; ++i) {
        // Parent div for each post
        post_elements[i] = build_element(container, "div", "class", "post"); 

        // Child h3 of post-story for index of each story
        let post_index = build_element(post_elements[i], "p", "class", "index");
        post_index.innerHTML = i + 1;

        let post_body = build_element(post_elements[i], 'div', 'class', 'post-body');

        // Child span of post for each story
        let post_story = build_element(post_body, "span", "class", "post-story");

        // Child link of post.story for each story 
        let post_story_link = build_element(post_story, "a", "href", post_array[i].url);
        post_story_link.innerHTML = post_array[i].title;

        // Child p source for each story's source
        let post_story_domain = undefined
        if (post_array[i].domain) {
            post_story_domain = build_element(post_story, "a", "class", "domain");
            post_story_domain.setAttribute("href", 'https://' + post_array[i].domain)
            post_story_domain.innerHTML = "(" + post_array[i].domain + ")";
        }

        // Child span of post for each story's metadata
        let post_meta = build_element(post_body, "span");
        post_meta.setAttribute("class", "post-span");

        // Child p user data
        let post_meta_user = build_element(post_meta, 'p');
        post_meta_user.innerHTML = post_array[i].points 
                                + " points by " 
                                + post_array[i].user
                                + " ";
        
        let post_meta_age = post_meta.appendChild(document.createElement("p"));
        post_meta_age.innerHTML = get_age(post_array[i].time);
        console.log(get_age(post_array[i].time));
        
        // Child a href to comments for each story meta span
        let post_meta_comments = build_element(post_meta, "a", "href", "#" + post_array[i].id); 
        post_meta_comments.innerHTML = post_array[i].comments_count + " comments";
        post_meta_comments.addEventListener('onhashchange', ()=>{fillComments(container)})

        let post_vr = build_element(post_meta, "pre");
        post_vr.innerHTML = '|';

        let post_divider = build_element(post_body, 'hr', 'class', 'post-divider');
    }

    return posts;
}

/**
 * Helper function to determine the age of a post from its creation time
 * @param {number} unix_time Time in seconds of creating this post since the unix epoch
 * @returns String describing the age of a post in the format "# (time-unit)s ago"
 */
function get_age(unix_time) {
    let age = Math.round(Date.now() / 1000) - unix_time; // Age of post in seconds
    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 31;
    let year = month * 12;

    if      (age <= minute)    return "  1 minute ago | ";
    else if (age <= hour)      return Math.round(age/60) + "  minutes ago | ";
    else if (age <= day)       return Math.round(age/60/60) + "  hours ago | ";
    else if (age <= month)     return Math.round(age/60/60/24) + "  days ago | ";
    
    else if (age >= year) {
        let full_date = unix_time.getMonth() + unix_time.getDay() + ", " + unix_time.getFullYear();
        return full_date + " | "
    }
    
    else return "ERROR";
}

function fillComments(container) {
    console.log(location.hash);
    let post = build_element(container, h1)
    
}

/**
 * onHashChange event handler
 */
function switchPage(container) {
    switch(location.hash) {
        case '#news':
            get_request("/news", container, fill_posts);
            break;
        case '#best':
            get_request("/best", container, fill_posts);
            break;
        case '#newest':
            get_request("/newest", container, fill_posts);
            break;
        default:
            // this is an post id
            get_request('/item/' + location.hash.slice(1), fillComments);
            break;
    }
}

/**
 * Main function
 */
function run() {
    container = document.getElementById("posts");
    get_request("/news", container, fill_posts);
    location.hash = "news";
    window.onhashchange = ()=>{switchPage(container)};
}

run();