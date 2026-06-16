import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="glass-panel"
          style={{ textAlign: 'center', marginTop: '2rem', padding: '3rem' }}
        >
          <h2 style={{ color: '#ef4444' }}>Something went wrong.</h2>
          <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>
            We've encountered an unexpected error. Please try refreshing the page.
          </p>
          {this.state.error && (
            <pre
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'left',
                overflowX: 'auto',
                color: '#fca5a5',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            >
              {this.state.error.toString()}
            </pre>
          )}
          <button
            className="btn btn-primary"
            style={{ marginTop: '2rem' }}
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
