import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertTriangle } from 'lucide-react';
import AntModal from './AntModal';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 1rem;
  border-radius: 12px;
  text-align: center;
  min-height: 200px;
`;

const ErrorIcon = styled.div`
  color: hsl(0, 61%, 70%);
  margin-bottom: 1rem;
  font-size: 3rem;
`;

const ErrorTitle = styled.h2`
  color: #007571;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: #333;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  max-width: 500px;
  line-height: 1.5;
`;

const ErrorDetails = styled.details`
  margin-bottom: 1.5rem;
  text-align: left;
  max-width: 500px;
  width: 100%;
`;

const ErrorSummary = styled.summary`
  color: #007571;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  background: hsl(185, 78%, 86%);
  margin-bottom: 0.5rem;

  &:hover {
    background: hsl(185, 78%, 80%);
  }
`;

const ErrorStack = styled.pre`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #666;
  overflow-x: auto;
  border: 1px solid #ddd;
`;

const RetryButton = styled.button`
  background: #007571;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: hsl(178, 100%, 23%);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <AntModal open={true} showCloseButton={false}>
          <ErrorContainer>
            <ErrorIcon>
              <AlertTriangle size={48} />
            </ErrorIcon>

            <ErrorTitle>Something went wrong</ErrorTitle>

            <ErrorMessage>
              We encountered an unexpected error. We will check the logs and
              prevent this from happening again. For now, try refreshing the
              page.
            </ErrorMessage>

            <ErrorDetails>
              <ErrorSummary>Technical Details (for developers)</ErrorSummary>
              <ErrorStack>
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </ErrorStack>
            </ErrorDetails>
          </ErrorContainer>
        </AntModal>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
