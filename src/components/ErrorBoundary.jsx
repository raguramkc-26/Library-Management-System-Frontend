import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    console.error("UI Crash:", err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h1 className="text-xl font-bold">Something went wrong.</h1>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;