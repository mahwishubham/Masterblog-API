// Function that runs once the window is fully loaded
window.onload = function() {
    // Attempt to retrieve the API base URL from the local storage
    var savedBaseUrl = localStorage.getItem('apiBaseUrl');
    // If a base URL is found in local storage, load the posts
    if (savedBaseUrl) {
        document.getElementById('api-base-url').value = savedBaseUrl;
        loadPosts();
    }
}

    // Attempt to retrieve the previous search term from local storage
    var savedSearchTerm = localStorage.getItem('searchTerm');
    // If a search term is found in local storage, set it in the input field
    if (savedSearchTerm) {
        document.getElementById('search-input').value = savedSearchTerm;
    }

// Function to fetch all the posts from the API and display them on the page
function loadPosts() {
    // Retrieve the base URL from the input field and save it to local storage
    var baseUrl = document.getElementById('api-base-url').value;
    localStorage.setItem('apiBaseUrl', baseUrl);

    // Use the Fetch API to send a GET request to the /posts endpoint
   fetch(baseUrl + '/posts')
    .then(response => response.json())
    .then(data => {
        const postContainer = document.getElementById('post-container');
        postContainer.innerHTML = '';

        data.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <div class="button-container">
                    <button onclick="showUpdateForm(${post.id})">Update</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                </div>`;
            postContainer.appendChild(postDiv);
        });
    })
    .catch(error => console.error('Error:', error));

}

// Function to send a POST request to the API to add a new post
function addPost() {
    // Retrieve the values from the input fields
    var baseUrl = document.getElementById('api-base-url').value;
    var postTitle = document.getElementById('post-title').value;
    var postContent = document.getElementById('post-content').value;

    // Use the Fetch API to send a POST request to the /posts endpoint
    fetch(baseUrl + '/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent })
    })
    .then(response => response.json())  // Parse the JSON data from the response
    .then(post => {
        console.log('Post added:', post);
        loadPosts(); // Reload the posts after adding a new one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

// Function to send a DELETE request to the API to delete a post
function deletePost(postId) {
    var baseUrl = document.getElementById('api-base-url').value;

    // Use the Fetch API to send a DELETE request to the specific post's endpoint
    fetch(baseUrl + '/posts/' + postId, {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Post deleted:', postId);
        loadPosts(); // Reload the posts after deleting one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

// Function to send a PUT request to the API to update a post
function updatePost(postId) {
    var baseUrl = document.getElementById('api-base-url').value;
    var updatedTitle = document.getElementById('updated-title').value;
    var updatedContent = document.getElementById('updated-content').value;

    // Use the Fetch API to send a PUT request to the specific post's endpoint
    fetch(baseUrl + '/posts/' + postId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: updatedTitle, content: updatedContent })
    })
    .then(response => response.json())  // Parse the JSON data from the response
    .then(post => {
        console.log('Post updated:', post);
        loadPosts(); // Reload the posts after updating one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

