import React, { useState } from 'react';
import { NestrationCanvas } from '../components/NestrationCanvas';
import * as imageUploader from '../client/imageUploader';
import { useGameContext } from '../effects/gameContext';
import { useTeardown } from '../effects/useSanity';

export const DrawPage = ({ room_code, title }) => {
  const { client } = useGameContext();
  const [isSending, setIsSending] = useState(false);
  
  const submit = async (blob) => {
    setIsSending(true);
    const url = await imageUploader.upload(room_code, title, blob);
    client.submitDrawing(url);
  };

  useTeardown(() => {
    setIsSending(false);
  });
  
  return (
    <div className="App">
      <header className="App-header">
        {title}
      </header>
      <NestrationCanvas onSubmit={submit} disabled={isSending} />
    </div>
  );
};
