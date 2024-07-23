// components/RunPythonComponent.tsx

import { fetchEventSource } from '@microsoft/fetch-event-source';
import React, { useState } from 'react';

import isBase64 from '../../tools/isBase64';

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
