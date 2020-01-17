import React from 'react';

import './ErrorMessage.scss';

interface ErrorMessage {
    message: string;
}

export const ErrorMessage = ({ message }: ErrorMessage) => (
    <span className="ErrorMessage">
        <span>{'\u26A0'}</span>
        <span> {message}</span>
    </span>
);
