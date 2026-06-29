// Async boundary — lets Module Federation init shared deps before use (avoids "eager consumption" error).
import('./bootstrap');

export {};
