import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import ComplaintList from './ComplaintList';
import { fetchComplaintsForAdmin } from '../../registration/api';

const Complaints = ({ isDarkMode }) => {
  // Filters and Pagination State
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Data State
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    total: 0
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Debounce Search Term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        page: currentPage,
        limit: limit,
        status: statusFilter,
        priority: priorityFilter,
        search: debouncedSearchTerm,
      };

      const response = await fetchComplaintsForAdmin(filters);

      const rawComplaints = response.data || [];
      const pagination = response.pagination || {};

      // Map complaints 
      const enrichedComplaints = rawComplaints.map((item, index) => {
        return {
          id: item.id,
          studentName: item.student_name || `Student ID: ${item.student_id}`,
          room: item.room_number || 'N/A',
          title: item.title,
          description: item.description,
          category: item.category,
          priority: item.priority || 'Normal',
          status: item.status || 'Pending',
          dateSubmitted: item.created_at,
          lastUpdated: item.updated_at || item.created_at,
          student_id: item.student_id,
          key: index,
        };
      });

      setComplaints(enrichedComplaints);
      setTotalPages(pagination.totalPages || 1);
      setTotalRecords(pagination.total || 0);

      // Note: Stats are complicated because the API now returns paginated data.
      // If the API doesn't return global stats, we can't accurately show "Open: 50" if we only fetched 10.
      // Ideally, the API should return a 'stats' object. 
      // For now, I will skip updating stats from the *paginated* list as it would be incorrect, 
      // or simplisticly set them to 0 or remove the stats cards if they are misleading, 
      // OR (better) assume the API *might* eventually return stats or we make a separate call.
      // The current backend rewritten doesn't return global stats, only filtered counts.
      // To keep UI consistent, I'll calculate stats based on the *current view* or just static/placeholder
      // until a specific stats API is made. Or, I can leave the old stats logic but applied to the fetched data
      // which is just a subset. That's confusing. 
      // I'll populate stats based on the response if possible, simplified for now.

      // Let's rely on the fact that if we filter by 'status=pending', the totalRecords IS the pending count.
      // But we can't get ALL counts at once without multiple queries. 
      // For this step I will NOT break the UI, but the numbers might only reflect the current filter context 
      // if I mapped them, or simpler: just leave them 0 or hide them? 
      // Actually, let's just not update them or set them to totalRecords recursively?
      // No, that's bad.
      // I'll leave basic calculating on the current "page" just so it doesn't crash, 
      // but users should know these are page-stats or similar.
      // Actually, I'll just set them to current loaded length to avoid errors.

      const newStats = {
        open: 0, // Placeholder
        inProgress: 0,
        resolved: 0,
        total: pagination.total || 0
      };
      setStats(newStats);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Trigger load on dependencies
  useEffect(() => {
    loadData();
  }, [currentPage, limit, statusFilter, priorityFilter, debouncedSearchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Complaint Management
        </h2>
      </div>

      {/* Stats Cards (Optional: Hide or Keep placeholder) */}
      {/* Keeping them but acknowledging they might not be accurate global stats without a dedicated stats API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card isDarkMode={isDarkMode}>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Records (Filtered)</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card isDarkMode={isDarkMode}>
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">All Complaints</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage and track student complaints
                </p>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by title, student, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />

              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className={`px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                className={`px-3 py-2 border rounded-md text-sm ${isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  }`}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading data...</span>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ComplaintList
              isDarkMode={isDarkMode}
              complaints={complaints}
              onRefresh={refreshData}
              pagination={{
                currentPage,
                totalPages,
                totalRecords,
                limit
              }}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Complaints;
