import React from 'react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">Security & Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Update Contact Details</h3>
          <form>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Student Contact</label>
                <input type="tel" defaultValue="+91 9876543210" className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Parent Contact</label>
                <input type="tel" defaultValue="+91 9876543211" className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <input type="email" defaultValue="rajesh.kumar@student.gce.edu" className="w-full px-4 py-3 glass-effect rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-0" required />
              </div>
              <button type="submit" className="w-full btn-primary text-white py-3 rounded-lg font-semibold">
                📱 Update Contact Details
              </button>
            </div>
          </form>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-slate-400 text-sm">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS Notifications</p>
                <p className="text-slate-400 text-sm">Receive notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-mark Attendance</p>
                <p className="text-slate-400 text-sm">Automatically mark attendance when in hostel</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-red-500 border-opacity-30">
          <h3 className="text-lg font-semibold text-red-400 mb-6">Danger Zone</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Download Account Data</h4>
              <p className="text-slate-400 text-sm mb-3">Download all your account data including attendance, bills, and complaints.</p>
              <button className="btn-secondary text-white px-4 py-2 rounded-lg font-medium">
                📄 Download Data
              </button>
            </div>

            <hr className="border-slate-600" />

            <div>
              <h4 className="text-red-400 font-medium mb-2">Deactivate Account</h4>
              <p className="text-slate-400 text-sm mb-3">Temporarily deactivate your account. You can reactivate it anytime.</p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                ⚠️ Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
