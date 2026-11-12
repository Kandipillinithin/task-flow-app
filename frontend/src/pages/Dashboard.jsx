import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const parsedId = parseInt(assignedTo, 10);
    try {
      await api.post('/tasks/', {
        title,
        description,
        priority,
        assigned_to: parsedId > 0 ? parsedId : null,
      });
      setTitle('');
      setDescription('');
      setAssignedTo('');
      fetchTasks();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'object' ? JSON.stringify(detail) : detail;
      alert(msg || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'object' ? JSON.stringify(detail) : detail;
      alert(msg || 'Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'object' ? JSON.stringify(detail) : detail;
      alert(msg || 'Failed to delete task');
    }
  };

  return (
    <div style={{ maxWidth: 850, margin: '30px auto', padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: 12 }}>
        <div>
          <h2>TaskFlow Dashboard</h2>
          <p>Logged in as: <strong>{user?.username}</strong> ({user?.role})</p>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ padding: '8px 14px', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      {(user?.role === 'manager' || user?.role === 'admin') && (
        <section style={{ margin: '20px 0', padding: 16, background: '#f8fafc', borderRadius: 6, color: '#111' }}>
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Task Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ flex: 1, padding: 8 }}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ flex: 2, padding: 8 }}
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: 8 }}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="number"
              placeholder="Assign User ID (e.g. 2)"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={{ width: 170, padding: 8 }}
            />
            <button type="submit" style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Add Task
            </button>
          </form>
        </section>
      )}

      <h3>Task List</h3>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr style={{ background: '#e2e8f0', color: '#111', textAlign: 'left' }}>
              <th style={{ padding: 8 }}>ID</th>
              <th style={{ padding: 8 }}>Title</th>
              <th style={{ padding: 8 }}>Assigned To</th>
              <th style={{ padding: 8 }}>Priority</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 8 }}>{t.id}</td>
                <td style={{ padding: 8 }}>
                  <strong>{t.title}</strong>
                  <div style={{ fontSize: '0.85em', color: '#888' }}>{t.description}</div>
                </td>
                <td style={{ padding: 8 }}>{t.assigned_to || 'Unassigned'}</td>
                <td style={{ padding: 8 }}>{t.priority}</td>
                <td style={{ padding: 8 }}>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td style={{ padding: 8 }}>
                  {(user?.role === 'manager' || user?.role === 'admin') && (
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
