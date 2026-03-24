class ErrorBoundary {
  constructor() {
    this.errorHandlers = new Map();
    this.globalErrorHandler = null;
    this.unhandledRejectionHandler = null;
  }

  init() {
    this.setupGlobalErrorHandler();
    this.setupUnhandledRejectionHandler();
    this.wrapAsyncFunctions();
    return this;
  }

  setupGlobalErrorHandler() {
    this.globalErrorHandler = (event) => {
      event.preventDefault();
      
      const error = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      };

      this.handleError(error, 'global');
    };

    window.addEventListener('error', this.globalErrorHandler);
  }

  setupUnhandledRejectionHandler() {
    this.unhandledRejectionHandler = (event) => {
      event.preventDefault();
      
      const error = {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        reason: event.reason
      };

      this.handleError(error, 'unhandledRejection');
    };

    window.addEventListener('unhandledrejection', this.unhandledRejectionHandler);
  }

  wrapAsyncFunctions() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok && response.status >= 400) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
      } catch (error) {
        this.handleError(error, 'fetch');
        throw error;
      }
    };
  }

  handleError(error, source) {
    const errorData = {
      ...error,
      source,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logError(errorData);

    const handlers = this.errorHandlers.get(source) || [];
    handlers.forEach(handler => {
      try {
        handler(errorData);
      } catch (e) {
        console.error('Error in error handler:', e);
      }
    });

    const globalHandlers = this.errorHandlers.get('*') || [];
    globalHandlers.forEach(handler => {
      try {
        handler(errorData);
      } catch (e) {
        console.error('Error in global error handler:', e);
      }
    });
  }

  logError(error) {
    const styles = [
      'background: #dc3545',
      'color: #fff',
      'padding: 4px 8px',
      'border-radius: 4px',
      'font-weight: bold'
    ].join(';');

    console.group('%c[ErrorBoundary]', styles);
    console.error('Error:', error);
    console.trace();
    console.groupEnd();

    if (typeof window.Analytics !== 'undefined' && window.Analytics?.track) {
      try {
        window.Analytics.track('error', {
          message: error.message,
          source: error.source,
          url: error.url
        });
      } catch (e) {
        // Silent fail for analytics
      }
    }
  }

  on(source, handler) {
    if (!this.errorHandlers.has(source)) {
      this.errorHandlers.set(source, []);
    }
    this.errorHandlers.get(source).push(handler);
    return this;
  }

  showUserFriendlyError(containerId, customMessage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const defaultMessage = 'Something went wrong. Please try refreshing the page.';
    const message = customMessage || defaultMessage;

    container.innerHTML = `
      <div class="error-container" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin: 20px auto;
        max-width: 400px;
      ">
        <div style="
          width: 60px;
          height: 60px;
          background: #dc3545;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin-bottom: 20px;
        ">!</div>
        <p style="color: #333; margin-bottom: 20px; font-size: 16px;">${message}</p>
        <button onclick="location.reload()" style="
          padding: 12px 24px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        ">Refresh Page</button>
      </div>
    `;

    const button = container.querySelector('button');
    if (button) {
      button.addEventListener('mouseenter', () => {
        button.style.background = '#0056b3';
      });
      button.addEventListener('mouseleave', () => {
        button.style.background = '#007bff';
      });
    }
  }

  showToastError(message, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
      <span>⚠️</span>
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">&times;</button>
    `;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #dc3545;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideUp 0.3s ease;
      font-family: inherit;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      .error-toast button {
        background: transparent;
        border: none;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: 5px;
      }
    `;
    
    if (!document.querySelector('style[data-error-toast]')) {
      style.setAttribute('data-error-toast', 'true');
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  wrap(fn, errorHandler) {
    return (...args) => {
      try {
        return fn.apply(this, args);
      } catch (error) {
        this.handleError(error, 'wrapped');
        if (errorHandler) {
          errorHandler(error);
        }
      }
    };
  }

  async wrapAsync(fn, errorHandler) {
    return async (...args) => {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        this.handleError(error, 'async');
        if (errorHandler) {
          errorHandler(error);
        }
        return null;
      }
    };
  }

  destroy() {
    if (this.globalErrorHandler) {
      window.removeEventListener('error', this.globalErrorHandler);
    }
    if (this.unhandledRejectionHandler) {
      window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
    }
    this.errorHandlers.clear();
  }
}

const errorBoundary = new ErrorBoundary().init();

export { ErrorBoundary, errorBoundary };
export default errorBoundary;
