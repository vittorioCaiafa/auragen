import { Audio } from 'expo-av';

let recording: Audio.Recording;

export const startRecording = async () => {
  try {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const { recording: rec } = await Audio.Recording.createAsync(
        {
            android: {
              extension: '.m4a',
              outputFormat: 2, // MPEG_4
        audioEncoder: 3, // AAC
              sampleRate: 44100,
              numberOfChannels: 2,
              bitRate: 128000,
            },
            ios: {
              extension: '.m4a',
              audioQuality: 0, // HIGH
              sampleRate: 44100,
              numberOfChannels: 2,
              bitRate: 128000,
              linearPCMBitDepth: 16,
              linearPCMIsBigEndian: false,
              linearPCMIsFloat: false,
            },
            web: {
              mimeType: 'audio/webm',
              bitsPerSecond: 128000,
            },
            isMeteringEnabled: false,
          }
          
    );

    recording = rec;
  } catch (error) {
    console.error('Error al comenzar la grabación', error);
  }
};

export const stopRecording = async (): Promise<string> => {
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    return uri!;
  } catch (error) {
    console.error('Error al detener la grabación', error);
    return '';
  }
};
