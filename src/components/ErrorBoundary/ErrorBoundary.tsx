import React from 'react';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

interface ErrorBoundaryState {
    hasErrors: boolean;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
    state: ErrorBoundaryState = {
        hasErrors: false
    }

    componentDidCatch(error: Error) {
        this.setState({ hasErrors: true });
        console.error(error);
    }

    render() {
        if (!this.state.hasErrors) {
            return this.props.children;
        }
        return (
            <div>
                <ErrorMessage message={'Something went wrong!'} />
            </div>
        );
    }
}
