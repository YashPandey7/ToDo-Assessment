import React, { useEffect, useState } from 'react';
import config from './ipConfig';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await fetch(`${config.backendEndpoint}/task/`);
        const actualData = await apiData.json();
        setData(actualData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add the note to the selected task (simulate adding the note for now)
      setSelectedTask({
        ...selectedTask,
        notes: [...selectedTask.notes, newNote]
      });
      setNewNote('');
    }
  };

  const handleDeleteTask = (taskId) => {
    // Make the API call to delete the task
    console.log(`Delete task with id: ${taskId}`);
    // After successful deletion, you can filter out the task from the list
  };

  const handleEditTask = () => {
    // Implement logic for editing task (open modal or update state)
    console.log(`Edit task: ${selectedTask.title}`);
  };

  return (
    <div className="container">
      <h1>📝 Todo List</h1>

      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Tags</th>
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
                <button onClick={() => handleEditTask(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                <button onClick={() => handleAddNote(task)}>Add Note</button>
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
          <p><strong>Tags:</strong> {selectedTask.user}</p>
          <p><strong>Assigned To:</strong> {selectedTask.user}</p>
          <p><strong>Notes:</strong></p>
          <ul>
            {selectedTask.notes?.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>

          {/* Add Note Section */}
          <input 
            type="text" 
            value={newNote} 
            onChange={(e) => setNewNote(e.target.value)} 
            placeholder="Add a new note" 
          />
          <button onClick={handleAddNote}>Save Note</button>

          {/* Edit and Delete buttons for detailed task view */}
          <button onClick={handleEditTask}>Edit Task</button>
          <button onClick={() => handleDeleteTask(selectedTask._id)}>Delete Task</button>
        </div>
      )}
    </div>
  );
};

export default App;
