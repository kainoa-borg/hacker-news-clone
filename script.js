function json_listener(obj) {
    obj = [...JSON.parse(this.responseText)];
}

function set_hn_obj(obj, url_target) {
    let url = "https://node-hnapi.herokuapp.com" + url_target;

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            obj.push(...JSON.parse(this.response));
        }
    };

    xhttp.open("GET", url, false);
    xhttp.send();   
}

function set_hn_obj_new(obj, url_target) {
    let url = "https://node-hnapi.herokuapp.com" + url_target;

    let xhttp = new XMLHttpRequest();

    xhttp.onload = json_listener(obj);
}

function build_element(container, elementType) {
    return container.appendChild(document.createElement(elementType));
}

function build_element(container, elementType, desired_attribute, desired_value) {
    temp = container.appendChild(document.createElement(elementType));
    temp.setAttribute(desired_attribute, desired_value);
    return temp;
}

function fill_posts(post_array, containerID) {
    container = document.getElementById(containerID);
    if (post_array.length < 1)
        return;
    for (i = 0; i < post_array.length; ++i) {
        // Parent div for each post
        let post = build_element(container, "div", "class", "post"); 

        // Child span of post for each story
        let post_story = build_element(post, "span", "class", "post-story");
        
        // Child h3 of post-story for index of each story
        let post_index = build_element(post_story, "p", "class", "index");
        post_index.innerHTML = i;

        // Child link of post.story for each story 
        let post_story_link = build_element(post_story, "a", "href", post_array[i].url);
        post_story_link.innerHTML = post_array[i].title;

        let post_story_domain = undefined
        // Child p source for each story's source
        if (post_array[i].domain) {
            let post_story_domain = build_element(post_story, "a", "class", "domain");
            post_story_domain.setAttribute("href", post_array[i].domain)
            post_story_domain.innerHTML = "(" + post_array[i].domain + ")";
        }

        // Child span of post for each story's metadata
        let post_meta = build_element(post, "span");
        post_meta.setAttribute("class", "post-span");

        // Child p user data
        let post_meta_user = post_meta.appendChild(document.createElement("p"));
        post_meta_user.innerHTML = post_array[i].points 
                                + " points by " 
                                + post_array[i].user
                                + " | "
        // Child a link to comments for each story meta span
        let post_meta_comments = build_element(post_meta, "a", "href", post_array[i].id); 
        post_meta_comments.innerHTML = post_array[i].comments_count + " comments | ";

    }
}


hn_obj = [];
set_hn_obj(hn_obj, "/news");

fill_posts(hn_obj, "posts");
