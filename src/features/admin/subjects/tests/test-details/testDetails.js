import React from 'react';
import { useLocation } from 'react-router-dom';

export default function TestDetails() {
    let location = useLocation();
    console.log(`location`, location);
    return <div>Test Details works</div>;
}
