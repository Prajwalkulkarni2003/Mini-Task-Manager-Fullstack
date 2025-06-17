from flask import Flask, jsonify, request
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


tasks = [
    {"id": 1, "title": "Buy groceries", "status": "pending", "createdAt": str(datetime.now())},
    {"id": 2, "title": "Complete assignment", "status": "done", "createdAt": str(datetime.now())}
]

#  GET all tasks
@app.route("/tasks", methods=["GET"])
def get_all_tasks():
    return jsonify(tasks)

#  POST a new task
@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.json
    new_id = max([task["id"] for task in tasks], default=0) + 1
    task = {
        "id": new_id,
        "title": data["title"],
        "status": data["status"],
        "createdAt": str(datetime.now())
    }
    tasks.append(task)
    return jsonify(task), 201

#  GET a single task by ID
@app.route("/tasks/<int:task_id>", methods=["GET"])
def get_task_by_id(task_id):
    task = next((t for t in tasks if t["id"] == task_id), None)
    return (jsonify(task), 200) if task else ("Task not found", 404)

#  PUT (update) a task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json
    for task in tasks:
        if task["id"] == task_id:
            task["title"] = data["title"]
            task["status"] = data["status"]
            return jsonify(task)
    return ("Task not found", 404)

#  DELETE a task
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t["id"] != task_id]
    return ("", 204)


@app.route("/")
def home():
    return "Flask backend is running!"

if __name__ == "__main__":
    app.run(debug=True)

