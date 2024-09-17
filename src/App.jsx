import React, { useState } from "react";
import QRCode from "react-qr-code";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const App = () => {
  const [links, setLinks] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const zip = new JSZip();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const extractedLinks = jsonData.map((row) => row[0]); // Assuming links are in the first column
      setLinks(extractedLinks);
    };

    reader.readAsArrayBuffer(file);
  };

  const generateQRCodes = () => {
    const newQrCodes = links.map((link, index) => {
      const qrFileName = `QRCode_${index + 1}`;
      return { link, qrFileName };
    });
    setQrCodes(newQrCodes);
  };

  const collectSVGs = () => {
    qrCodes.forEach(({ link, qrFileName }) => {
      const svgElement = document.getElementById(qrFileName);
      if (svgElement) {
        const svgContent = new XMLSerializer().serializeToString(svgElement);
        zip.file(`${qrFileName}.svg`, svgContent);
      }
    });
  };

  const downloadAllSVGs = () => {
    collectSVGs();
    zip
      .generateAsync({ type: "blob" })
      .then((content) => {
        saveAs(content, "QRCodes.zip");
      })
      .catch((error) => {
        console.error("Error generating ZIP:", error);
      });
  };

  const exportExcelWithQRCodeNames = () => {
    const worksheetData = qrCodes.map(({ link, qrFileName }) => [
      link,
      qrFileName,
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Links & QR Codes");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Links_QRCodes.xlsx");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>QR Code Generator</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={styles.fileInput}
      />
      {links.length > 0 && (
        <button onClick={generateQRCodes} style={styles.button}>
          Generate QR Codes
        </button>
      )}
      {qrCodes.length > 0 && (
        <button onClick={downloadAllSVGs} style={styles.button}>
          Download All QR Codes as SVG
        </button>
      )}
      {qrCodes.length > 0 && (
        <button onClick={exportExcelWithQRCodeNames} style={styles.button}>
          Export Excel with QR Codes
        </button>
      )}
      {qrCodes.length > 0 && (
        <div style={styles.qrWrapper}>
          {qrCodes.map(({ link, qrFileName }, index) => (
            <div key={index} style={styles.qrItem}>
              <div style={styles.qrImageContainer}>
                <QRCode value={link} size={100} id={qrFileName} />
              </div>
              <p style={styles.qrLabel}>{qrFileName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f0f4f8",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontFamily: "Arial, sans-serif",
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
  },
  fileInput: {
    marginBottom: "20px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  qrWrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "20px",
  },
  qrItem: {
    margin: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  qrImageContainer: {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    display: "inline-block",
  },
  qrLabel: {
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    color: "#555",
  },
};

export default App;
