import React from 'react';

const MainContent = ({ children }) => {
  return (
    <main className="flex-1 min-w-0 p-6 overflow-y-auto main-content">
      {children}
    </main>
  );
};

export default MainContent;
