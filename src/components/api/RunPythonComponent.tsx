// components/RunPythonComponent.tsx

import { fetchEventSource } from '@microsoft/fetch-event-source';
import React, { useState } from 'react';

function isBase64(str: string) {
  if (typeof str !== 'string') {
      return false;
  }
  // Remove data URL prefix if present
  if (str.indexOf('data:') === 0) {
      str = str.split(',')[1];
  }
  // Check if the string is valid Base64
  try {
      return btoa(atob(str)) === str;
  } catch (err) {
      return false;
  }
}

const RunPythonComponent: React.FC = () => {
  const [output, setOutput] = useState<string>('');

  const runPythonScript = async () => {
    await fetchEventSource(("/api/run-python"), {
      method: "POST",
      onmessage(ev) {
        if(isBase64(ev.data)){
          setOutput((prevOutput) => prevOutput + atob(ev.data));
        } else {
          setOutput((prevOutput) => prevOutput + ev.data);
        }
      }
    });
  };

  return (
    <div>
      <button onClick={runPythonScript}>Run Python Script</button>
      <div>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default RunPythonComponent;
