// NotificationForm.js

import React, { useState } from 'react';
import { sendNotification } from '../Config';

const NotificationForm = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send the notification
    await sendNotification(title, body);
    // Clear the form
    setTitle('');
    setBody('');
  };

  return (
    <div>
      <h2>Send Notification</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Body:</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <button type="submit">Send Notification</button>
      </form>
    </div>
  );
};

export default NotificationForm;
