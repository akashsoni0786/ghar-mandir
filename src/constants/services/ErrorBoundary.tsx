import { Component, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // allow passing a custom fallback
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to a reporting service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    // Reset error state
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        // If a custom fallback was passed
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{ padding: "20px", color: "red" }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || "An unknown error occurred"}</p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: "8px 16px",
              marginTop: "10px",
              border: "1px solid red",
              borderRadius: "4px",
              cursor: "pointer",
              background: "white",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
