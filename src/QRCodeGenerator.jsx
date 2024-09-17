import React from 'react';
import QRCode from 'react-qr-code'; // Using 'react-qr-code' as it's more reliable with Vite

const QRCodeGenerator = ({ text }) => {
  return (
    <div style={styles.qrContainer}>
      <QRCode value={text} size={200} />
    </div>
  );
};

const styles = {
  qrContainer: {
    display: 'inline-block',
    padding: '20px',
    border: '2px solid #000',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    marginTop: '20px',
  },
};

export default QRCodeGenerator;
