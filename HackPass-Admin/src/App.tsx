import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

import './App.css'

function App() {
  const [data, setData] = useState('No result');
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    
    const startScanner = async () => {
      try {
        await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            setData(result.getText());
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    startScanner();

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <h2>QR Code Scanner</h2>
      <video ref={videoRef} style={{ width: '300px' }} />
      <p>Scanned Data: {data}</p>
    </div>
  );
}

export default App
