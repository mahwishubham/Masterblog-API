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

function sleep(ms) {
  var start = new Date().getTime(), expire = start + ms;
  while (new Date().getTime() < expire) { }
  return;
}

// helper
function showUpdateForm(postId) {
    const updateButton = document.getElementById(`updateButton_${postId}`);
    const updateForm = document.getElementById(`updateForm_${postId}`);

    updateButton.style.display = 'none'; // Hide the "Update" button
    updateForm.style.display = 'block'; // Display the update form
}

// Function to send a PUT request to the API to update a post
function updatePost(postId) {
    var baseUrl = document.getElementById('api-base-url').value;
    var updatedTitle = document.getElementById('updateTitle_' + postId).value.trim();
    var updatedContent = document.getElementById('updateContent_' + postId).value.trim();

    // Create an object to conditionally include non-empty title and content
    var dataToUpdate = {};
    if(updatedTitle != '') {
        dataToUpdate.title = updatedTitle;
    }
    if(updatedContent != '') {
        dataToUpdate.content = updatedContent;
    }

    console.log(updatedTitle, updatedContent, dataToUpdate)

    // Use the Fetch API to send a PUT request to the specific post's endpoint
    fetch(baseUrl + '/posts/' + postId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate) // Use the conditionally constructed object
    })
    .then(response => response.json())  // Parse the JSON data from the response
    .then(post => {
        console.log('Post updated:', post);
        loadPosts(); // Reload the posts after updating one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    
    sleep(1000)
}

// Function to toggle the display of search inputs and buttons
function toggleSearchInput() {
    var searchTitleInput = document.getElementById('searchTitleInput');
    var searchContentInput = document.getElementById('searchContentInput');
    var enterButton = document.getElementById('enterButton');
    var cancelButton = document.getElementById('cancelButton');

    if (searchTitleInput.style.display === 'none') {
        searchTitleInput.style.display = 'block';
        searchContentInput.style.display = 'block';
        enterButton.style.display = 'inline';
        cancelButton.style.display = 'inline';
        searchTitleInput.focus();
    } else {
        searchTitleInput.style.display = 'none';
        searchContentInput.style.display = 'none';
        enterButton.style.display = 'none';
        cancelButton.style.display = 'none';
        searchTitleInput.value = '';
        searchContentInput.value = '';
        loadPosts();
    }
}

// Function to search for posts by title or content
function searchPosts() {
    var baseUrl = document.getElementById('api-base-url').value;
    var searchTitle = document.getElementById('searchTitleInput').value;
    var searchContent = document.getElementById('searchContentInput').value;

    // Use the Fetch API to send a GET request to the /api/posts/search endpoint with the search queries
    fetch(`${baseUrl}/posts/search?title=${encodeURIComponent(searchTitle)}&content=${encodeURIComponent(searchContent)}`)
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
                        <button id="updateButton_${post.id}" onclick="showUpdateForm(${post.id})">Update</button>
                        <button onclick="deletePost(${post.id})">Delete</button>
                    </div>
                    <form class="update-form" id="updateForm_${post.id}" style="display: none;">
                        <input type="text" id="updateTitle_${post.id}" placeholder="New Title">
                        <textarea id="updateContent_${post.id}" placeholder="New Content"></textarea>
                        <button onclick="updatePost(${post.id})">Save</button>
                    </form>`;
                postContainer.appendChild(postDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Function to cancel the search and reset the UI
function cancelSearch() {
    var searchTitleInput = document.getElementById('searchTitleInput');
    var searchContentInput = document.getElementById('searchContentInput');
    searchTitleInput.value = '';
    searchContentInput.value = '';
    toggleSearchInput();
}

// Event listener to trigger searchPosts() when Enter key is pressed in the search input field
// document.getElementById('searchInput').addEventListener('keyup', handleSearchKeyPress);

// Function to fetch all the posts from the API and display them on the page
function loadPosts() {
    // Retrieve the base URL from the input field and save it to local storage
    var baseUrl = document.getElementById('api-base-url').value;
    localStorage.setItem('apiBaseUrl', baseUrl);

    // Retrieve the sort option and direction from the input fields
    var sortOption = document.getElementById('sort-option').value;
    var sortDirection = document.getElementById('sort-direction').value;

    // Build the API URL with the sort parameters
    var apiUrl = baseUrl + '/posts?sort=' + sortOption + '&direction=' + sortDirection;

    // Use the Fetch API to send a GET request to the /posts endpoint
   fetch(apiUrl)
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
                    <button id="updateButton_${post.id}" onclick="showUpdateForm(${post.id})">Update</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                </div>
                <form class="update-form" id="updateForm_${post.id}" style="display: none;">
                    <input type="text" id="updateTitle_${post.id}" placeholder="New Title">
                    <textarea id="updateContent_${post.id}" placeholder="New Content"></textarea>
                    <button onclick="updatePost(${post.id})">Save</button>
                 </form>`;
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