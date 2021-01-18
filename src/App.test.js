import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

xtest('renders learn react link', () => {
    render(<App />);
    // const linkElement = screen.getByText(/Hello Student/i);
    // expect(linkElement).toBeInTheDocument();
});
