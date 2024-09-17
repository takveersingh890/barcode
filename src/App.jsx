import React, { useState } from 'react';
import QRCodeGenerator from './QRCodeGenerator';

const App = () => {
  const [url, setUrl] = useState('');

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Generate QR Code for a URL or Text</h1>
      <textarea
        value={url}
        onChange={handleInputChange}
        placeholder="Enter URL or text here"
        style={styles.textarea}
        rows="5"
      />
      <div style={styles.qrWrapper}>
        {url && <QRCodeGenerator text={url} />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  title: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    marginBottom: '20px',
  },
  textarea: {
    padding: '10px',
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    resize: 'none',  // Prevents resizing if you want to maintain size
  },
  qrWrapper: {
    marginTop: '20px',
  },
};

export default App;
