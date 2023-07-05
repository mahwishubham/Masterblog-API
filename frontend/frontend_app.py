from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST', 'DELETE', 'PUT'])
def home():
    if request.method == 'GET':
        return render_template("index.html")
    elif request.method == 'POST':
        return render_template("index.html")
    elif request.method == 'DELETE':
        return render_template("index.html")
    elif request.method == 'PUT':
        return render_template("index.html")


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
