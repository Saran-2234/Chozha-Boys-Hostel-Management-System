import SessionManager from '../../Common/SessionManager';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">Security & Settings</h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Change Password</h3>
          <form>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
                <input type="password" className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" placeholder="Enter current password" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                <input type="password" className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" placeholder="Enter new password" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Confirm New Password</label>
                <input type="password" className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" placeholder="Confirm new password" required />
              </div>
              <button type="submit" className="w-full btn-primary text-white py-3 rounded-lg font-semibold">
                🔒 Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Session Management */}
        <SessionManager />
      </div>
    </div>
  );
};

export default Settings;
