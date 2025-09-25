import React from 'react';

const MainContent = ({ children }) => {
  return (
    <main className="flex-1 p-6 overflow-auto relative z-50">
      {children}
    </main>
  );
};

export default MainContent;
