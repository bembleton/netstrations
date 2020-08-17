import React, { useState } from 'react';
import { useInput } from '../effects/useInput';
import { useGameContext } from '../effects/gameContext';
import { useSetup, useTeardown } from '../effects/useSanity';
import * as imageUploader from '../client/imageUploader';
import { NestrationCanvas } from '../components/NestrationCanvas';

export const RegisterPage = ({ room_code }) => {
  const { client } = useGameContext();
  const { value: name, bind: bindName } = useInput('');
  const [hasName, setHasName] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  useSetup(() => {
    client.room_code = room_code;
  });

  const applyName = () => {
    setHasName(true);
  };

  const submit = async (blob) => {
    setIsSending(true);
    const avatar_url = await imageUploader.upload(room_code, name, blob);
    client.registerPlayer(name, avatar_url);
  };

  useTeardown(() => {
    setIsSending(false);
  });

  const nameForm = (
    <div className="App-section spaced">
      <label>Your Name:</label>
      <input
        type="text"
        {...bindName}
        spellCheck={false}
        className="font-large dense"
      />
      <button onClick={applyName} className="button-primary">Next</button>
    </div>
  );

  const avatarForm = (
    <div className="App-section spaced">
      <label>Draw a Picture of Yourself</label>
      <NestrationCanvas onSubmit={submit} disabled={isSending} />
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        Room: {room_code}
      </header>
      {!hasName ? nameForm : avatarForm}
    </div>
  );
};
