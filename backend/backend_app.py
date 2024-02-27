import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

def sort_helper(posts, key, direction):
    """
    Helper function to sort posts based on a given key and direction.

    Args:
        posts (list): List of posts to be sorted.
        key (str): The key by which to sort the posts.
        direction (str): The direction of sorting, either "asc" (ascending) or "desc" (descending).

    Returns:
        list: Sorted list of posts.
    """
    reverse = direction == "desc"
    return sorted(posts, key=lambda x: x[key], reverse=reverse)

def getUniqueId():
    """
    Generate a unique ID for posts.

    Returns:
        int: Unique ID generated using UUID.
    """
    return uuid.uuid1().int>>64

POSTS = [
    {"id": getUniqueId(), "title": "First post", "content": "This is the first post."},
    {"id": getUniqueId(), "title": "Second post", "content": "This is the second post."},
    {"id": getUniqueId(), "title": "My third post", "content": "This is the third post."},
]

@app.route('/api/posts', methods=['GET', 'POST'])
def handle_posts():
    """
    Handle GET and POST requests for posts.

    Returns:
        json: List of posts if GET request, newly created post if POST request.
    """
    if request.method == "GET":
        sort = request.args.get("sort")
        direction = request.args.get("direction")
        posts = POSTS.copy()
        if sort and direction:
            posts = sort_helper(posts, sort, direction)
        return jsonify(posts)
    elif request.method == "POST":
        id = getUniqueId()
        data = {
            "id": id,
            "title": request.json["title"],
            "content": request.json["content"]
        }
        if data['title'] != '' and data['content'] != '':
            POSTS.append(data)
        else:
            error_message = "Title and content cannot be missing."
            return jsonify({"error": error_message}), 400

        return jsonify(POSTS)

@app.route('/api/posts/search', methods=["GET"])
def search_post():
    """
    Search posts based on given query parameters such as title and content.

    Returns:
        json: List of posts matching the search criteria.
    """
    title = request.args.get('title')
    content = request.args.get('content')
    search_results = []

    if title is not None or content is not None:
        for post in POSTS:
            post_title = post['title'].lower() if post['title'] else ''
            post_content = post['content'].lower() if post['content'] else ''

            if (title is None or title.lower() in post_title) and (content is None or content.lower() in post_content):
                search_results.append(post)

    return jsonify(search_results)


@app.route('/api/posts/<int:id>', methods=["DELETE"])
def delete_post(id):
    """
    Delete a post based on its ID.

    Args:
        id (int): ID of the post to be deleted.

    Returns:
        json: Confirmation message if post is deleted, error message if post is not found.
    """
    if request.method == "DELETE":
        for post in POSTS:
            if post['id'] == id:
                POSTS.remove(post)
                return jsonify({'message': f'Post with ID # {id} is deleted'})
        return jsonify({'error': 'Post not found'}), 404

@app.route('/api/posts/<int:id>', methods=["PUT"])
def update_post(id):
    """
    Update a post based on its ID.

    Args:
        id (int): ID of the post to be updated.

    Returns:
        json: Updated post if found, error message if post is not found.
    """
    if request.method == "PUT":
        data = request.get_json()
        for post in POSTS:
            if post['id'] == id:
                post["title"] = data.get('title', post['title'])
                post["content"] = data.get('content', post['content'])
                return jsonify(post)
        return jsonify({'error': 'Post not found'}), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)