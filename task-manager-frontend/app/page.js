"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const backendURL = "https://mini-task-manager-fullstack.onrender.com";

  const fetchAllTasks = async () => {
    const res = await axios.get(`${backendURL}/tasks`);
    setTasks(res.data);
    setSearchResults([]);
    setEditingTask(null);
    setTitle("");
    setStatus("pending");
  };

  const handleAdd = async () => {
    if (!title.trim()) return;

    await axios.post(`${backendURL}/tasks`, {
      title,
      status,
    });

    setTitle("");
    setStatus("pending");
    fetchAllTasks();
  };

  const handleSearchByTitle = async () => {
    const res = await axios.get(`${backendURL}/tasks`);
    const matched = res.data.filter(
      (t) => t.title.toLowerCase() === searchTitle.toLowerCase()
    );
    setSearchResults(matched);
    setTasks([]);
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setStatus(task.status);
  };

  const handleUpdate = async () => {
    if (!editingTask) return;

    await axios.put(`${backendURL}/tasks/${editingTask.id}`, {
      title: editingTask.title,
      status,
    });

    setEditingTask(null);
    setTitle("");
    setStatus("pending");
    fetchAllTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${backendURL}/tasks/${id}`);
    fetchAllTasks();
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-6">
        <h1 className="text-2xl font-bold">Mini Task Manager</h1>

        {/* Add or Edit Task */}
        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Enter task title"
            disabled={editingTask}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          <button
            onClick={editingTask ? handleUpdate : handleAdd}
            className={`${
              editingTask ? "bg-yellow-500" : "bg-blue-600"
            } text-white px-4 py-2 rounded`}
          >
            {editingTask ? "Update Status" : "Add Task"}
          </button>
        </div>

        {/* Search by Title */}
        <div className="flex gap-2">
          <input
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Search tasks by title"
          />
          <button
            onClick={handleSearchByTitle}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Search Tasks
          </button>
        </div>

        {/* Get All Tasks */}
        <div>
          <button
            onClick={fetchAllTasks}
            className="bg-gray-800 text-white px-4 py-2 rounded mt-2"
          >
            Get All Tasks
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="border p-4 rounded bg-green-50 mt-4">
            <h2 className="text-lg font-semibold text-green-800">
              Search Results:
            </h2>
            <ul className="divide-y">
              {searchResults.map((task) => (
                <li
                  key={task.id}
                  className="p-2 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>ID:</strong> {task.id} |{" "}
                      <strong>Title:</strong> {task.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Status:</strong> {task.status} |{" "}
                      <strong>Created:</strong> {task.createdAt}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-yellow-600 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* All Tasks List */}
        {tasks.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">All Tasks:</h2>
            <ul className="divide-y">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="p-2 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>ID:</strong> {task.id} |{" "}
                      <strong>Title:</strong> {task.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Status:</strong> {task.status} |{" "}
                      <strong>Created:</strong> {task.createdAt}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-yellow-600 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
