import React, { useState } from 'react';
import Button from '../Common/Button';
import { promoteStudents } from '../../registration/api';

const Promotion = ({ isDarkMode }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password.trim()) {
      setError('Admin password is required to authorize promotion.');
      setMessage('');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await promoteStudents(password.trim());
      if (response?.success) {
        setMessage(response.message || 'Promotion completed successfully.');
        setPassword(''); // Clear password on success
      } else {
        setError(response?.error || 'Promotion failed.');
      }
    } catch (err) {
      setError(err.message || 'Promotion failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPassword('');
    setMessage('');
    setError('');
  };

  const sectionTextColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200';
  const descriptionText = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const helperText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <section className={`p-6 min-h-screen ${sectionTextColor}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className={`rounded-2xl p-6 shadow-lg ${cardBg}`}>
          <div className="mb-6">
            <h2 className="text-3xl font-semibold">Promotion</h2>
            <p className={`mt-2 text-sm ${descriptionText}`}>
              Promote students to the next academic year. Final year students will be archived.
              <br />
              <span className="font-bold text-red-500">Warning: This action cannot be undone.</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-slate-900 border-slate-700 focus:ring-blue-500 text-white' : 'bg-white border-slate-200 focus:ring-blue-500 text-gray-900'}`}
                placeholder="Enter your password to confirm"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading} isDarkMode={isDarkMode} className="min-w-[160px]">
                {loading ? 'Processing...' : 'Authorize & Promote'}
              </Button>
            </div>
          </form>
        </div>
        {(message || error) && (
          <div
            className={`rounded-2xl p-4 border ${message ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-red-500 bg-red-500/10 text-red-400'}`}
          >
            <p>{message || error}</p>
          </div>
        )}
        <div className={`rounded-2xl p-6 ${cardBg}`}>
          <h3 className="text-lg font-semibold mb-3">Promotion Steps</h3>
          <ol className={`list-decimal list-inside space-y-2 text-sm ${helperText}`}>
            <li><strong>Authenticate:</strong> Enter admin password to verify authority.</li>
            <li><strong>Archive:</strong> 4th-year students are moved to the archive table.</li>
            <li><strong>Cleanup:</strong> 4th-year students are removed from the active students list.</li>
            <li><strong>Promote:</strong> 1st, 2nd, and 3rd-year students are promoted to the next year.</li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Promotion;
