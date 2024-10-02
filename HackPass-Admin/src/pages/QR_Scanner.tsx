import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import axios from 'axios';

import '../App.css'

function QR_Scanner() {
  const [data, setData] = useState<string | null>(null); // State to hold scanned data
  const [scanning, setScanning] = useState(true); // State to control camera visibility
  const videoRef = useRef(null); // Reference to the video element

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        // Start scanning from the video device
        await codeReader.decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
          if (result) {
            setData(result.getText()); // Store scanned data
            setScanning(false); // Stop scanning
            codeReader.reset(); // Stop the camera
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (scanning) {
      startScanner();
    }

    return () => {
      codeReader.reset(); // Clean up on component unmount
    };
  }, [scanning]);

  const handleScanAgain = () => {
    setData(null); // Reset scanned data
    setScanning(true); // Restart scanning
  };

  const handleUserCheckin = () => {
    console.log('workin')
    axios.put(`http://localhost:8080/user/${data}`)
  }

  return (
    <div>
      {scanning ? (
        <>
          <h2>QR Code Scanner</h2>
          <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
        </>
      ) : (
        <>
          <h2>Scanned Data</h2>
          <p>{data}</p>
          <div>
            <button onClick={handleUserCheckin}>Check in User</button>
          </div>
          <div>
            <button onClick={handleScanAgain}>Scan New QR Code</button>
          </div>
        </>
      )}
    </div>
  );
}

export default QR_Scanner
