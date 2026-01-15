import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fix: Define explicit interfaces for Props and State to resolve TypeScript errors
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fix: Pass interfaces to generic Component type to properly type this.state and this.props
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: Initialize state with typed object
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("System Critical Error:", error, errorInfo);
  }

  render() {
    // Fix: Access typed state
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-red-500 font-mono p-4">
          <div className="border border-red-500/50 p-8 bg-red-950/10 rounded max-w-lg w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
            <h1 className="text-3xl font-bold mb-4 tracking-widest uppercase">System Failure</h1>
            <p className="mb-4 text-red-300">CRITICAL ERROR DETECTED IN KERNEL.</p>
            <div className="bg-black/50 p-4 rounded text-xs text-red-400 overflow-auto max-h-40 mb-4 font-mono">
              {this.state.error?.toString()}
              <br/>
              {this.state.error?.stack && <span className="opacity-50 mt-2 block">{this.state.error.stack}</span>}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-red-500 hover:bg-red-500 hover:text-black transition-colors uppercase text-sm tracking-wider w-full"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    // Fix: Access typed props
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* Fix: ErrorBoundary now correctly accepts children via interface definition */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);