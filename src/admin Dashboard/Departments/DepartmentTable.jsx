import React from 'react';
import Button from '../Common/Button';

const DepartmentTable = ({ isDarkMode, departments, onRefresh }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
          Total departments: {departments.length}
        </div>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="small"
          isDarkMode={isDarkMode}
        >
          Refresh
        </Button>
      </div>

      {/* Mobile: stacked cards */}
      <div className="space-y-3 sm:hidden">
        {departments.length > 0 ? (
          departments.map(department => (
            <div key={department.id} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {department.department || 'N/A'}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    ID: {department.id || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`px-4 py-3 text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            No departments found
          </div>
        )}
      </div>

      {/* Desktop/tablet: show table on sm+ */}
      <div className="hidden sm:block overflow-x-auto">
        <table className={`w-full border-collapse ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
              <th className={`text-left py-3 px-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} font-medium`}>
                ID
              </th>
              <th className={`text-left py-3 px-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} font-medium`}>
                Department Name
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((department) => (
                <tr key={department.id} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-white hover:bg-opacity-5' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {department.id || 'N/A'}
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {department.department || 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center">
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No departments found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentTable;
