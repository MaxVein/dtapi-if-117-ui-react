import React from 'react';
import { render, screen } from '@testing-library/react';
import Subjects from './index';
import { objectsAreSame, filterArr, getRecords } from './apiService';
import axios from 'axios';
//jest.mock('axios');
test('is Subjects render work', () => {
    render(<Subjects />);
});

test('test should return true', () => {
    const x = { a: '1', b: 2, c: 3 };
    const y = { a: '1', b: 2, c: 3 };
    expect(objectsAreSame(x, y)).toBeTruthy();
});
test('test should return false', () => {
    const x = { a: '1', b: 2, c: 3 };
    const y = { b: 1, a: 2, c: 3 };
    expect(objectsAreSame(x, y)).not.toBeTruthy();
});
test('test should return object which have search option', () => {
    const x = [
        { a: '1', b: '2', c: '3' },
        { a: '10', b: '30', c: '30' },
        { a: '-10', b: '-30', c: '-30' },
    ];
    const z = [{ a: '1', b: '2', c: '3' }];
    const y = '2';
    expect(filterArr(x, y)).toEqual(z);
});
xtest('test axios get method', () => {
    const result = [
        {
            subject_description: 'Один із фундаментальних предметів',
            subject_id: '1',
            subject_name: 'Вища математикa',
        },
        {
            subject_description: 'Вивчення алгоритмів і основних структур даних',
            subject_id: '23',
            subject_name: 'Алгоритми і структури даних',
        },
    ];
    const resp = { data: result };
    axios.get.mockResolvedValue(resp);
    return getRecords().then((data) => expect(data).toEqual(resp));
});
