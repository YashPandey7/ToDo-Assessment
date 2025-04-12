import React, { useEffect, useState } from 'react';
import config from './ipConfig';
import './App.css'; // Optional for styling

const App = () => {
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

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

  return (
    <div className="container">
      <h1>📝 Todo List</h1>

      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {data.map((task) => (
            <tr key={task._id} onClick={() => handleTaskClick(task)}>
              <td>{task.title}</td>
              <td>{task.priority}</td>
              <td>{task.user}</td>
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
          <p><strong>Tags:</strong> {selectedTask.tags?.join(', ')}</p>
          <p><strong>Assigned To:</strong> {selectedTask.user}</p>
          <p><strong>Notes:</strong></p>
          <ul>
            {selectedTask.notes?.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
