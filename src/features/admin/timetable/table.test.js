import React from 'react';
import { render, screen } from '@testing-library/react';

import Timetable from './index';
test('is Subjects render work', () => {
    render(<Timetable />);
});
