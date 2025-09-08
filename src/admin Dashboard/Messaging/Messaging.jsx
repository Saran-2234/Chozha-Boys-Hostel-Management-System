import React from 'react';
import AnnouncementForm from './AnnouncementForm';

const Messaging = () => {
  return (
    <section id="messaging" className="section active">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Messaging</h2>
        <p className="text-slate-400">Send announcements and messages to students</p>
      </div>

      <AnnouncementForm />
    </section>
  );
};

export default Messaging;
