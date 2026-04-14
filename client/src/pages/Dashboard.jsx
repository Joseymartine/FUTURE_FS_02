import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, LogOut, MessageSquare, 
  CheckCircle, Clock, Trash2, Edit3, TrendingUp 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../api/axios';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState([]);
  const [sourceStats, setSourceStats] = useState([]);
  const [activeTab, setActiveTab] = useState('leads');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', source: 'Manual Entry', notes: '' });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
      calculateStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateStats = (data) => {
    const sourceCounts = data.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});

    const counts = data.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    const chartData = [
      { name: 'New', value: counts.new || 0, color: '#81A6C6' },
      { name: 'Contacted', value: counts.contacted || 0, color: '#AACDDC' },
      { name: 'In Progress', value: counts['in-progress'] || 0, color: '#D2C4B4' },
      { name: 'Converted', value: counts.converted || 0, color: '#2ecc71' },
      { name: 'Closed', value: counts.closed || 0, color: '#95a5a6' },
    ].filter(item => item.value > 0);

    const sourceData = Object.keys(sourceCounts).map(source => ({
      name: source,
      count: sourceCounts[source]
    }));

    setStats(chartData);
    setSourceStats(sourceData);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/leads/${id}/status`, { status: newStatus });
      fetchLeads();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (err) {
        alert('Error deleting lead');
      }
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', newLead);
      setShowAddModal(false);
      setNewLead({ name: '', email: '', phone: '', source: 'Manual Entry', notes: '' });
      fetchLeads();
    } catch (err) {
      alert('Error adding lead');
    }
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    window.location.href = '/login';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-card">
        <div className="logo">CRM Dash</div>
        <nav>
          <button 
            className={`nav-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <Users size={20} /> Leads
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={20} /> Analytics
          </button>
        </nav>
        <button onClick={handleLogout} className="logout-btn nav-item">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>Lead Overview</h1>
          <div className="header-actions">
            {activeTab === 'leads' && (
              <button className="add-lead-btn" onClick={() => setShowAddModal(true)}>
                + New Lead
              </button>
            )}
            <div className="admin-info">
              <span>Admin</span>
              <div className="avatar">A</div>
            </div>
          </div>
        </header>

        {activeTab === 'leads' ? (
          <>
            {/* Analytics Section - Mini Version */}
            <section className="analytics-section">
              <div className="glass-card stat-card">
                <h3>Lead Distribution</h3>
                <div style={{ height: 200, width: '100%', minWidth: 0 }}>
                  {stats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" debounce={1}>
                      <PieChart>
                        <Pie
                          data={stats}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="no-stats-placeholder" style={{ 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem'
                    }}>
                      No data available
                    </div>
                  )}
                </div>
              </div>
              <div className="glass-card stat-card total-leads">
                <h3>Total Leads</h3>
                <div className="big-number">{leads.length}</div>
                <p>Recent influx: +{leads.filter(l => l.status === 'new').length} new</p>
              </div>
            </section>

            {/* Table Section */}
            <section className="table-section glass-card">
              <div className="table-controls">
                <div className="search-bar">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search leads..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <Filter size={18} />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in-progress">In Progress</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredLeads.map((lead) => (
                        <motion.tr 
                          key={lead.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          layout
                        >
                          <td>{lead.name}</td>
                          <td>{lead.email}</td>
                          <td>
                            <select 
                              className={`status-badge status-${lead.status}`}
                              value={lead.status}
                              onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in-progress">In Progress</option>
                              <option value="converted">Converted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                          <td className="actions">
                            <button onClick={() => handleViewDetails(lead)} className="action-btn tip" title="View details"><MessageSquare size={16} /></button>
                            <button onClick={() => handleDelete(lead.id)} className="action-btn delete"><Trash2 size={16} /></button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filteredLeads.length === 0 && !loading && (
                  <div className="no-data">No leads found matching your search.</div>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="full-analytics-view">
            <div className="analytics-grid">
              <div className="glass-card analytics-card wide">
                <h3>Leads by Source</h3>
                <div style={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card analytics-card">
                <h3>Conversion Funnel</h3>
                <div style={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats}
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <motion.div 
            className="modal-content glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add New Person</h2>
            <form onSubmit={handleAddLead}>
              <div className="input-group">
                <input 
                  type="text" placeholder="Name" required 
                  value={newLead.name} onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                />
              </div>
              <div className="input-group">
                <input 
                  type="email" placeholder="Email" required 
                  value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                />
              </div>
              <div className="input-group">
                <input 
                  type="text" placeholder="Phone" 
                  value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                />
              </div>
              <div className="input-group">
                <input 
                  type="text" placeholder="Source (e.g. Website, Referral)" 
                  value={newLead.source} onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                />
              </div>
              <div className="input-group">
                <textarea 
                  placeholder="Notes" 
                  value={newLead.notes} onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="submit-btn">Add Lead</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <motion.div 
            className="modal-content glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lead-detail-header">
              <h2>Lead Details</h2>
              <span className={`status-badge status-${selectedLead.status}`}>{selectedLead.status}</span>
            </div>
            <div className="lead-info-grid">
              <div className="info-item"><strong>Name:</strong> {selectedLead.name}</div>
              <div className="info-item"><strong>Email:</strong> {selectedLead.email}</div>
              <div className="info-item"><strong>Phone:</strong> {selectedLead.phone || 'N/A'}</div>
              <div className="info-item"><strong>Source:</strong> {selectedLead.source}</div>
              <div className="info-item"><strong>Joined:</strong> {new Date(selectedLead.created_at).toLocaleString()}</div>
            </div>
            <div className="info-item full">
              <strong>Notes:</strong>
              <p className="notes-display">{selectedLead.notes || 'No notes available.'}</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowViewModal(false)} className="submit-btn">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
