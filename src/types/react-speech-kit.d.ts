declare module "react-speech-kit" {
  export interface SpeechSynthesisHook {
    speak: (options: { text: string }) => void;
    cancel: () => void;
    speaking: boolean;
  }

  export function useSpeechSynthesis(): SpeechSynthesisHook;
}
