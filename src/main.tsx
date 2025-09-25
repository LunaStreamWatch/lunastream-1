import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== "undefined") {
  const sendToParent = (data: any) => {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(data, "*");
      }
    } catch {}
  };

  window.addEventListener("error", (event) => {
    console.log("[Runtime Error]", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });

    // Send structured payload to parent iframe
    sendToParent({
      type: "ERROR_CAPTURED",
      error: {
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        source: "window.onerror",
      },
      timestamp: Date.now(),
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.log("[Unhandled Promise Rejection]", event.reason);

    const reason: any = event.reason;
    const message =
      typeof reason === "object" && reason?.message
        ? String(reason.message)
        : String(reason);
    const stack = typeof reason === "object" ? reason?.stack : undefined;

    // Mirror to parent iframe as well
    sendToParent({
      type: "ERROR_CAPTURED",
      error: {
        message,
        stack,
        filename: undefined,
        lineno: undefined,
        colno: undefined,
        source: "unhandledrejection",
      },
      timestamp: Date.now(),
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);