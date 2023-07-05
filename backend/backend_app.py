from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

POSTS = [
    {"id": 1, "title": "First post", "content": "This is the first post."},
    {"id": 2, "title": "Second post", "content": "This is the second post."},
]


@app.route('/api/posts', methods=['GET', 'POST'])
def get_posts():
    if request.method == "GET":
        return jsonify(POSTS)
    elif request.method == "POST":
        id = len(POSTS) + 1
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


@app.route('/api/posts/<int:id>', methods=["DELETE"])
def delete_post(id):
    if request.method == "DELETE":
        for post in POSTS:
            if post['id'] == id:
                POSTS.remove(post)
                return jsonify({'message': f'Post with ID # {id} is deleted'})
        return jsonify({'error': 'Post not found'}), 404


@app.route('/api/posts/<int:id>', methods=["PUT"])
def update_post(id):
    if request.method == "PUT":
        for post in POSTS:
            if post['id'] == id:
                post["title"] = request.json["title"]
                post["content"] = request.json["content"]
                if post['title'] != '' and post['content'] != '':
                    return jsonify(post)
                else:
                    error_message = "Title and content cannot be missing."
                    return jsonify({"error": error_message}), 400
        return jsonify({'error': 'Post not found'}), 404


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)
