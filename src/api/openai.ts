const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const transcribeAudio = async (audioUri: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    name: 'audio.m4a',
    type: 'audio/m4a',
  } as any);
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  const result = await response.json();
  return result.text;
};

export const sendToGPT = async (message: string): Promise<string> => {
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Actúa como un psicólogo empático y profesional.' },
      { role: 'user', content: message },
    ],
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return result.choices[0].message.content;
};
