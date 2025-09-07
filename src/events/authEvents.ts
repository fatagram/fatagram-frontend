import { useCallback } from 'react';
const authEventTarget = new EventTarget();

export const authEvents = {
    on: (event: string, callback: EventListenerOrEventListenerObject) => {
        authEventTarget.addEventListener(event, callback);
    },
    off: (event: string, callback: EventListenerOrEventListenerObject) => {
        authEventTarget.removeEventListener(event, callback);
    },
    emit: (event: string, detail?: any) => {
        authEventTarget.dispatchEvent(new CustomEvent(event, { detail }));
    }
}