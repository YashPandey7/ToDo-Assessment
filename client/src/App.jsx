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

  const [filters, setFilters] = useState({ tag: '', priority: '', user: '' });
  const [sortOption, setSortOption] = useState('dateDesc');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${config.backendEndpoint}/task/`);
      const tasks = await res.json();
      setData(tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleTaskClick = (task) => setSelectedTask(task);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await fetch(`${config.backendEndpoint}/task/${selectedTask._id}/note`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newNote }),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setSelectedTask(updatedTask);
        fetchTasks();
        setNewNote('');
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const handleDeleteNote = async (noteIndex) => {
    const updatedNotes = selectedTask.notes.filter((_, idx) => idx !== noteIndex);
    try {
      const res = await fetch(`${config.backendEndpoint}/task/${selectedTask._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes }),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setSelectedTask(updatedTask);
        fetchTasks();
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`${config.backendEndpoint}/task/${taskId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setData((prev) => prev.filter((task) => task._id !== taskId));
        if (selectedTask?._id === taskId) setSelectedTask(null);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
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
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const filteredAndSortedTasks = data
    .filter(task => {
      const tagMatch = filters.tag ? task.tags.includes(filters.tag) : true;
      const priorityMatch = filters.priority ? task.priority === filters.priority : true;
      const userMatch = filters.user ? task.user === filters.user : true;
      return tagMatch && priorityMatch && userMatch;
    })
    .sort((a, b) => {
      if (sortOption === 'dateAsc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === 'dateDesc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === 'priorityAsc') return a.priority.localeCompare(b.priority);
      if (sortOption === 'priorityDesc') return b.priority.localeCompare(a.priority);
      return 0;
    });

  return (
    <div className="container">
      <h1>📝 Todo List</h1>
      <button className="add-btn" onClick={() => setShowModal(true)}>➕ Add New Task</button>

      <div className="filters">
        <input
          placeholder="Filter by tag"
          value={filters.tag}
          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
        />
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
        >
          <option value="">All Users</option>
          <option>user1</option>
          <option>user2</option>
          <option>user3</option>
          <option>user4</option>
          <option>user5</option>
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="dateDesc">Newest First</option>
          <option value="dateAsc">Oldest First</option>
          <option value="priorityAsc">Priority A → Z</option>
          <option value="priorityDesc">Priority Z → A</option>
        </select>
      </div>

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
          {filteredAndSortedTasks.map((task) => (
            <tr key={task._id} onClick={() => handleTaskClick(task)}>
              <td>{task.title}</td>
              <td>{task.priority}</td>
              <td>{task.user}</td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }}>Delete</button>
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
          <p><strong>Tags:</strong> {selectedTask.tags?.join(', ')}</p>
          <p><strong>Created At:</strong> {new Date(selectedTask.createdAt).toLocaleString()}</p>
          <p><strong>Notes:</strong></p>
          <ul>
            {selectedTask.notes?.map((note, idx) => (
              <li key={idx}>
                {note.text} <button onClick={() => handleDeleteNote(idx)}>❌</button>
              </li>
            ))}
          </ul>
          <input 
            type="text" 
            value={newNote} 
            onChange={(e) => setNewNote(e.target.value)} 
            placeholder="Add a new note" 
          />
          <button onClick={handleAddNote}>Save Note</button>
          <br/><br/>
          <button onClick={() => handleEditTask(selectedTask)}>Edit Task</button>
          <button onClick={() => handleDeleteTask(selectedTask._id)}>Delete Task</button>
        </div>
      )}

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
