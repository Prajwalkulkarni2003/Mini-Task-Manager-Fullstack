import axios from 'axios';

const API = 'http://localhost:5000/tasks';

export const getTasks = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const addTask = async (task) => {
  const res = await axios.post(API, task);
  return res.data;
};

export const updateTask = async (id, task) => {
  const res = await axios.put(`${API}/${id}`, task);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
