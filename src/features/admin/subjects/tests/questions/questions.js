import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Questions() {
    let location = useLocation();
    console.log(`location`, location);
    return <div>Questions works</div>;
}
