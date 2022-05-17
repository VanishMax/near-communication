import './assets/index.css'
import startApp from './app';

// This is needed because the signIn function of NEAR asks for the global Buffer
import { Buffer as BufferPolyfill } from 'buffer'
declare var Buffer: typeof BufferPolyfill;
// @ts-ignore
globalThis.Buffer = BufferPolyfill
// @ts-ignore
globalThis.process = { env: import.meta.env };

startApp();
