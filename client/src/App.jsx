import React, { useEffect, useState } from 'react';
import config from './ipConfig';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    priority: 'Medium',
    user: 'user1',
  });
  const [editFormData, setEditFormData] = useState({
    _id: '',
    title: '',
    description: '',
    tags: '',
    priority: '',
    user: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const apiData = await fetch(`${config.backendEndpoint}/task/`);
      const actualData = await apiData.json();
      setData(actualData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const updatedTask = {
        ...selectedTask,
        notes: [...selectedTask.notes, { text: newNote }],
      };

      try {
        await fetch(`${config.backendEndpoint}/task/${selectedTask._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        });
        fetchTasks();
        setSelectedTask(updatedTask);
        setNewNote('');
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`${config.backendEndpoint}/task/${taskId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setData((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        if (selectedTask && selectedTask._id === taskId) setSelectedTask(null);
      } else {
        console.error('Failed to delete task');
      }
    } catch (err) {
      console.error('Error while deleting task:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditFormData({
      _id: task._id,
      title: task.title,
      description: task.description,
      tags: task.tags.join(', '),
      priority: task.priority,
      user: task.user,
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitNewTask = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      notes: [],
    };

    try {
      const res = await fetch(`${config.backendEndpoint}/task/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const createdTask = await res.json();
        setData([...data, createdTask]);
        setShowModal(false);
        setFormData({ title: '', description: '', tags: '', priority: 'Medium', user: 'user1' });
      } else {
        console.error('Failed to create task');
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleSubmitEditedTask = async (e) => {
    e.preventDefault();
    const updatedTask = {
      ...editFormData,
      tags: editFormData.tags.split(',').map(tag => tag.trim()),
    };

    try {
      const res = await fetch(`${config.backendEndpoint}/task/${editFormData._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (res.ok) {
        fetchTasks();
        setShowEditModal(false);
        setSelectedTask(null);
      } else {
        console.error('Failed to update task');
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="container">
      <h1>📝 Todo List</h1>

      <button className="add-btn" onClick={() => setShowModal(true)}>➕ Add New Task</button>

      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((task) => (
            <tr key={task._id} onClick={() => handleTaskClick(task)}>
              <td>{task.title}</td>
              <td>{task.priority}</td>
              <td>{task.user}</td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }}>Delete</button>
                <button onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}>Add Note</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTask && (
        <div className="task-details">
          <h2>Task Details</h2>
          <p><strong>Title:</strong> {selectedTask.title}</p>
          <p><strong>Description:</strong> {selectedTask.description}</p>
          <p><strong>Priority:</strong> {selectedTask.priority}</p>
          <p><strong>Assigned To:</strong> {selectedTask.user}</p>
          <p><strong>Notes:</strong></p>
          <ul>
            {selectedTask.notes?.map((note, idx) => (
              <li key={idx}>{note.text}</li>
            ))}
          </ul>

          <input 
            type="text" 
            value={newNote} 
            onChange={(e) => setNewNote(e.target.value)} 
            placeholder="Add a new note" 
          />
          <button onClick={handleAddNote}>Save Note</button>
          <button onClick={() => handleEditTask(selectedTask)}>Edit Task</button>
          <button onClick={() => handleDeleteTask(selectedTask._id)}>Delete Task</button>
        </div>
      )}

      {/* Modal for Adding Task */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Task</h2>
            <form onSubmit={handleSubmitNewTask}>
              <input name="title" value={formData.title} onChange={handleFormChange} placeholder="Title" required />
              <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Description" />
              <input name="tags" value={formData.tags} onChange={handleFormChange} placeholder="Tags (comma separated)" />
              <select name="priority" value={formData.priority} onChange={handleFormChange}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select name="user" value={formData.user} onChange={handleFormChange}>
                <option>user1</option>
                <option>user2</option>
                <option>user3</option>
                <option>user4</option>
                <option>user5</option>
              </select>
              <div className="modal-actions">
                <button type="submit">Add Task</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Task */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <form onSubmit={handleSubmitEditedTask}>
              <input name="title" value={editFormData.title} onChange={handleEditFormChange} placeholder="Title" required />
              <textarea name="description" value={editFormData.description} onChange={handleEditFormChange} placeholder="Description" />
              <input name="tags" value={editFormData.tags} onChange={handleEditFormChange} placeholder="Tags (comma separated)" />
              <select name="priority" value={editFormData.priority} onChange={handleEditFormChange}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select name="user" value={editFormData.user} onChange={handleEditFormChange}>
                <option>user1</option>
                <option>user2</option>
                <option>user3</option>
                <option>user4</option>
                <option>user5</option>
              </select>
              <div className="modal-actions">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
