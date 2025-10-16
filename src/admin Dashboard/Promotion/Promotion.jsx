import React, { useState } from 'react';
import Button from '../Common/Button';
import { promoteStudents } from '../../registration/api';

const Promotion = ({ isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [deleteFinalYear, setDeleteFinalYear] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError('Recipient email is required.');
      setMessage('');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await promoteStudents(email.trim(), deleteFinalYear);
      if (response?.success) {
        setMessage(response.message || 'Promotion completed successfully.');
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
    setEmail('');
    setDeleteFinalYear(true);
    setMessage('');
    setError('');
  };

  const sectionTextColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200';
  const descriptionText = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const helperBg = isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-slate-50 border border-slate-200';
  const helperText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <section className={`p-6 min-h-screen ${sectionTextColor}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className={`rounded-2xl p-6 shadow-lg ${cardBg}`}>
          <div className="mb-6">
            <h2 className="text-3xl font-semibold">Promotion</h2>
            <p className={`mt-2 text-sm ${descriptionText}`}>
              Promote students to the next academic year and email the 4th-year CSV to the chosen recipient.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Recipient Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-slate-900 border-slate-700 focus:ring-blue-500 text-white' : 'bg-white border-slate-200 focus:ring-blue-500 text-gray-900'}`}
                placeholder="admin@example.com"
              />
            </div>
            <div className={`flex items-start justify-between rounded-xl px-4 py-3 ${helperBg}`}>
              <div className="pr-4">
                <p className="font-medium">Delete 4th-year students after promotion</p>
                <p className={`text-sm mt-1 ${descriptionText}`}>
                  The 4th-year CSV will always be emailed. Enable this option to remove them from the system afterward.
                </p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={deleteFinalYear}
                  onChange={(e) => setDeleteFinalYear(e.target.checked)}
                />
                <div className={`relative w-14 h-8 transition-colors rounded-full ${deleteFinalYear ? 'bg-blue-600' : isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}>
                  <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${deleteFinalYear ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </label>
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading} isDarkMode={isDarkMode} className="min-w-[160px]">
                {loading ? 'Processing...' : 'Run Promotion'}
              </Button>
              <Button type="button" variant="outline" isDarkMode={isDarkMode} onClick={resetForm}>
                Reset
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
          <h3 className="text-lg font-semibold mb-3">Promotion steps</h3>
          <ol className={`list-decimal list-inside space-y-2 text-sm ${helperText}`}>
            <li>4th-year student records are exported and emailed to the recipient.</li>
            <li>4th-year students are removed when deletion is enabled.</li>
            <li>Remaining students are promoted to the next academic year.</li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Promotion;
