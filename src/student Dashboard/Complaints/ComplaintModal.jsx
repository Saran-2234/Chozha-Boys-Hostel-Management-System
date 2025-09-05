import React from 'react';

const ComplaintModal = ({ onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Complaint submitted');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Raise New Complaint</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Category *</label>
                  <select className="w-full px-4 py-3 glass-effect rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" required>
                    <option value="">Select Category</option>
                    <option value="room">Room Issues</option>
                    <option value="mess">Mess/Food</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="cleanliness">Cleanliness</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Priority</label>
                  <select className="w-full px-4 py-3 glass-effect rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Subject *</label>
                <input type="text" className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" placeholder="Brief description of the issue" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Detailed Description *</label>
                <textarea rows="4" className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0 resize-none" placeholder="Please provide detailed information about the issue..." required></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
                <input type="text" className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" placeholder="e.g., Room A-204, 2nd Floor Corridor, Mess Hall" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Attach Photo (Optional)</label>
                <input type="file" accept="image/*" className="w-full px-4 py-3 glass-effect rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" />
                <p className="text-xs text-slate-400 mt-1">JPG, PNG or GIF (Max 5MB)</p>
              </div>

              <div className="flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="btn-secondary text-white px-6 py-3 rounded-lg font-medium">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-white px-6 py-3 rounded-lg font-medium">
                  📝 Submit Complaint
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
