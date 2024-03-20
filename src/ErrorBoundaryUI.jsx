import React, { Component } from 'react';
import Page404 from './components/404/404Page';

class ErrorBoundaryUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error:null,
      errorInfo:null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
  
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by Error Boundary:', errorInfo);
    this.setState({ error, errorInfo });
  }

  
render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <>
      {/* <h1>Something went wrong.</h1>
      <p> {this.state.error && this.state.error.toString()} </p> */}
       <Page404 error={this.state.error} hasError={this.state.hasError} errorInfo={this.state.errorInfo}/>

      </>
    }

    return this.props.children; 
  }
}

export default ErrorBoundaryUI;