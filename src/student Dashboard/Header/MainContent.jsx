import React from 'react';

const MainContent = ({ children }) => {
  return (
    <main className="flex-1 p-6 overflow-auto">
      {children}
    </main>
  );
};

export default MainContent;
