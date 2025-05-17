import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="p-6 max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-4">Something went wrong.</h2>
          <p>Please try refreshing the page or come back later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
