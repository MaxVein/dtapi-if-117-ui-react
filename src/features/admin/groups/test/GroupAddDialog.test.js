import {
    genereteTableData,
    getSpecName,
    getFacName,
    getSpecId,
    getFacId,
    delGroupsData,
    updateGroupsData,
    addGroupsData,
} from '../GroupsService';
import axios from 'axios';
jest.mock('axios');

it('test should return object which correct data', () => {
    const x = [
        {
            data: [
                { faculty_id: '1', group_id: '1', group_name: 'АКм-13-3', speciality_id: '1' },
                {
                    faculty_id: '2',
                    group_id: '2',
                    group_name: 'АКм-',
                    speciality_id: '2',
                },
                {
                    faculty_id: '3',
                    group_id: '3',
                    group_name: 'АКм-13-',
                    speciality_id: '3',
                },
            ],
        },
        {
            data: [
                {
                    speciality_code: '15121',
                    speciality_id: '1',
                    speciality_name: "Автоматизація та комп'ютерні наук",
                },
                {
                    speciality_code: '15122',
                    speciality_id: '2',
                    speciality_name: "Автоматизація та комп'ютерні наук",
                },
                {
                    speciality_code: '15123',
                    speciality_id: '3',
                    speciality_name: "Автоматизація та комп'ютерні наук",
                },
            ],
        },
        {
            data: [
                {
                    faculty_description: 'Вивчення  програмування і ооп',
                    faculty_id: '1',
                    faculty_name: 'Програмна ',
                },
                {
                    faculty_description: ' основ програмування і ооп',
                    faculty_id: '2',
                    faculty_name: ' інженерія',
                },
                {
                    faculty_description: 'Вивчення основ  і ооп',
                    faculty_id: '3',
                    faculty_name: 'Програмна інженерія',
                },
            ],
        },
    ];
    const y = [
        {
            faculty_id: '1',
            group_id: '1',
            group_name: 'АКм-13-3',
            speciality_id: '1',
            speciality_name: "Автоматизація та комп'ютерні наук",
            faculty_name: 'Програмна ',
        },
        {
            faculty_id: '2',
            group_id: '2',
            group_name: 'АКм-',
            speciality_id: '2',
            speciality_name: "Автоматизація та комп'ютерні наук",
            faculty_name: ' інженерія',
        },
        {
            faculty_id: '3',
            group_id: '3',
            group_name: 'АКм-13-',
            speciality_id: '3',
            speciality_name: "Автоматизація та комп'ютерні наук",
            faculty_name: 'Програмна інженерія',
        },
    ];
    expect(genereteTableData(x)).toEqual(y);
});

it('test should return object which correct spec name', () => {
    const x = '1';
    let y = [
        { speciality_name: "Автоматизація та комп'ютерні наук", speciality_id: '1' },
        { speciality_name: 'Метрологі', speciality_id: '2' },
        { speciality_name: " Комп'ютерна інженері", speciality_id: '3' },
        { speciality_name: 'Просто спеціальніст ', speciality_id: '164' },
        { speciality_name: 'Ерготерапія sal', speciality_id: '170' },
        { speciality_name: 'Телекомунікації та радіотехніка', speciality_id: '171' },
        { speciality_name: 'Геотектоніка23', speciality_id: '176' },
        { speciality_name: 'Геологія твердих горючих копалин', speciality_id: '177' },
        { speciality_name: 'Геофізика', speciality_id: '178' },
        { speciality_name: 'Право1', speciality_id: '264' },
        { speciality_name: 'Інженерія програмного забезпечення', speciality_id: '399' },
        { speciality_name: 'Архітектура та містобудування', speciality_id: '401' },
    ];
    const z = `Автоматизація та комп'ютерні наук`;
    expect(getSpecName(x, y)).toEqual(z);
});

it('test should return object which correct fac name', () => {
    const x = '1';
    let y = [
        { faculty_name: 'Програмна інженерія', faculty_id: '1' },
        { faculty_name: 'Тестимо факультет1', faculty_id: '44' },
        { faculty_name: 'Автоматизація та компютерні наукии', faculty_id: '45' },
        { faculty_name: 'Інститут інформаційних технологій', faculty_id: '77' },
        { faculty_name: 'Факультет фармаціїї', faculty_id: '80' },
        { faculty_name: 'Факультет соціології', faculty_id: '381' },
        { faculty_name: 'Філософія', faculty_id: '432' },
        { faculty_name: 'tuhes', faculty_id: '511' },
        { faculty_name: 'qwe', faculty_id: '512' },
        { faculty_name: 'Факультет прикладної фізики', faculty_id: '513' },
        { faculty_name: 'Інформаційних технологій', faculty_id: '514' },
    ];
    const z = `Програмна інженерія`;
    expect(getFacName(x, y)).toEqual(z);
});

it('test should return object which correct spec id', () => {
    const x = `Автоматизація та комп'ютерні наук`;
    let y = [
        { speciality_name: "Автоматизація та комп'ютерні наук", speciality_id: '1' },
        { speciality_name: 'Метрологі', speciality_id: '2' },
        { speciality_name: " Комп'ютерна інженері", speciality_id: '3' },
        { speciality_name: 'Просто спеціальніст ', speciality_id: '164' },
        { speciality_name: 'Ерготерапія sal', speciality_id: '170' },
        { speciality_name: 'Телекомунікації та радіотехніка', speciality_id: '171' },
        { speciality_name: 'Геотектоніка23', speciality_id: '176' },
        { speciality_name: 'Геологія твердих горючих копалин', speciality_id: '177' },
        { speciality_name: 'Геофізика', speciality_id: '178' },
        { speciality_name: 'Право1', speciality_id: '264' },
        { speciality_name: 'Інженерія програмного забезпечення', speciality_id: '399' },
        { speciality_name: 'Архітектура та містобудування', speciality_id: '401' },
    ];
    const z = `1`;
    expect(getSpecId(x, y)).toEqual(z);
});

it('test should return object which correct fac id', () => {
    const x = `Програмна інженерія`;
    const y = [
        { faculty_name: 'Програмна інженерія', faculty_id: '1' },
        { faculty_name: 'Тестимо факультет1', faculty_id: '44' },
        { faculty_name: 'Автоматизація та компютерні наукии', faculty_id: '45' },
        { faculty_name: 'Інститут інформаційних технологій', faculty_id: '77' },
        { faculty_name: 'Факультет фармаціїї', faculty_id: '80' },
        { faculty_name: 'Факультет соціології', faculty_id: '381' },
        { faculty_name: 'Філософія', faculty_id: '432' },
        { faculty_name: 'tuhes', faculty_id: '511' },
        { faculty_name: 'qwe', faculty_id: '512' },
        { faculty_name: 'Факультет прикладної фізики', faculty_id: '513' },
        { faculty_name: 'Інформаційних технологій', faculty_id: '514' },
    ];
    const z = `1`;
    expect(getFacId(x, y)).toEqual(z);
});

it('del method should work', async () => {
    const x = '1';
    const y = [
        {
            faculty_id: '1',
            faculty_name: 'Програмна інженерія',
            group_id: '1',
            group_name: 'АКм-13-2',
            speciality_id: '1',
            speciality_name: "Автоматизація та комп'ютерні наук",
        },
        {
            faculty_id: '77',
            faculty_name: 'Інститут інформаційних технологій',
            group_id: '2',
            group_name: 'СІ-12-4',
            speciality_id: '177',
            speciality_name: 'Геологія твердих горючих копалин',
        },
        {
            faculty_id: '44',
            faculty_name: 'Тестимо факультет1',
            group_id: '3',
            group_name: 'АК-16-2',
            speciality_id: '171',
            speciality_name: 'Телекомунікації та радіотехніка',
        },
        {
            faculty_id: '77',
            faculty_name: 'Інститут інформаційних технологій',
            group_id: '4',
            group_name: 'ТК-12-1',
            speciality_id: '171',
            speciality_name: 'Телекомунікації та радіотехніка',
        },
    ];
    const z = [
        {
            faculty_id: '77',
            faculty_name: 'Інститут інформаційних технологій',
            group_id: '2',
            group_name: 'СІ-12-4',
            speciality_id: '177',
            speciality_name: 'Геологія твердих горючих копалин',
        },
        {
            faculty_id: '44',
            faculty_name: 'Тестимо факультет1',
            group_id: '3',
            group_name: 'АК-16-2',
            speciality_id: '171',
            speciality_name: 'Телекомунікації та радіотехніка',
        },
        {
            faculty_id: '77',
            faculty_name: 'Інститут інформаційних технологій',
            group_id: '4',
            group_name: 'ТК-12-1',
            speciality_id: '171',
            speciality_name: 'Телекомунікації та радіотехніка',
        },
    ];
    axios.get.mockResolvedValue({
        data: y,
    });
    const resp = await delGroupsData(x, y);

    expect(resp).toEqual(z);
});

it('edit method works', async () => {
    const x = [
        {
            faculty_id: '1',
            group_id: '1',
            group_name: 'АКм-13-3',
            speciality_id: '1',
            speciality_name: "Автоматизація та комп'ютерні наук",
            faculty_name: 'Програмна ',
        },
        {
            faculty_id: '2',
            group_id: '2',
            group_name: 'АКм-',
            speciality_id: '2',
            speciality_name: 'Метрологі',
            faculty_name: ' Тестимо факультет1',
        },
        {
            faculty_id: '3',
            group_id: '3',
            group_name: 'АКм-13-',
            speciality_id: '3',
            speciality_name: "Комп'ютерна інженері",
            faculty_name: 'Автоматизація та компютерні наукии',
        },
    ];
    const y = {
        data: {
            group_name: 'АКм-13-2',
            faculty_name: 'Програмна ',
            speciality_name: "Автоматизація та комп'ютерні наук",
        },
        edit: true,
        editId: '1',
        isChanged: true,
    };
    const z = [
        {
            faculty_id: '1',
            group_id: '1',
            group_name: 'АКм-13-2',
            speciality_id: '1',
            speciality_name: "Автоматизація та комп'ютерні наук",
            faculty_name: 'Програмна ',
        },
        {
            faculty_id: '2',
            group_id: '2',
            group_name: 'АКм-',
            speciality_id: '2',
            speciality_name: 'Метрологі',
            faculty_name: ' Тестимо факультет1',
        },
        {
            faculty_id: '3',
            group_id: '3',
            group_name: 'АКм-13-',
            speciality_id: '3',
            speciality_name: "Комп'ютерна інженері",
            faculty_name: 'Автоматизація та компютерні наукии',
        },
    ];
    let specs = [
        { speciality_name: "Автоматизація та комп'ютерні наук", speciality_id: '1' },
        { speciality_name: 'Метрологі', speciality_id: '2' },
        { speciality_name: "Комп'ютерна інженері", speciality_id: '3' },
        { speciality_name: 'Просто спеціальніст ', speciality_id: '164' },
        { speciality_name: 'Ерготерапія sal', speciality_id: '170' },
        { speciality_name: 'Телекомунікації та радіотехніка', speciality_id: '171' },
        { speciality_name: 'Геотектоніка23', speciality_id: '176' },
        { speciality_name: 'Геологія твердих горючих копалин', speciality_id: '177' },
        { speciality_name: 'Геофізика', speciality_id: '178' },
        { speciality_name: 'Право1', speciality_id: '264' },
        { speciality_name: 'Інженерія програмного забезпечення', speciality_id: '399' },
        { speciality_name: 'Архітектура та містобудування', speciality_id: '401' },
    ];
    const facks = [
        { faculty_name: 'Програмна ', faculty_id: '1' },
        { faculty_name: 'Тестимо факультет1', faculty_id: '44' },
        { faculty_name: 'Автоматизація та компютерні наукии', faculty_id: '45' },
        { faculty_name: 'Інститут інформаційних технологій', faculty_id: '77' },
        { faculty_name: 'Факультет фармаціїї', faculty_id: '80' },
        { faculty_name: 'Факультет соціології', faculty_id: '381' },
        { faculty_name: 'Філософія', faculty_id: '432' },
        { faculty_name: 'tuhes', faculty_id: '511' },
        { faculty_name: 'qwe', faculty_id: '512' },
        { faculty_name: 'Факультет прикладної фізики', faculty_id: '513' },
        { faculty_name: 'Інформаційних технологій', faculty_id: '514' },
    ];
    axios.post.mockResolvedValue({
        data: [
            {
                faculty_id: '1',
                group_id: '1',
                group_name: 'АКм-13-2',
                speciality_id: '1',
            },
        ],
    });
    const resp = await updateGroupsData(x, y, facks, specs);
    expect(resp).toEqual(z);
});

it('add method should work', async () => {
    const x = {
        add: true,
        data: {
            faculty_name: 'Програмна інженерія',
            group_name: 'АКм-13-2jп',
            speciality_name: "Автоматизація та комп'ютерні наук",
        },
    };
    let specs = [
        { speciality_name: "Автоматизація та комп'ютерні наук", speciality_id: '1' },
        { speciality_name: 'Метрологі', speciality_id: '2' },
        { speciality_name: "Комп'ютерна інженері", speciality_id: '3' },
        { speciality_name: 'Просто спеціальніст ', speciality_id: '164' },
    ];
    const facks = [
        { faculty_name: 'Програмна інженерія', faculty_id: '1' },
        { faculty_name: 'Тестимо факультет1', faculty_id: '44' },
        { faculty_name: 'Автоматизація та компютерні наукии', faculty_id: '45' },
        { faculty_name: 'Інститут інформаційних технологій', faculty_id: '77' },
    ];
    const z = {
        faculty_id: '1',
        faculty_name: 'Програмна інженерія',
        group_id: '530',
        group_name: 'АКм-13-2jп',
        speciality_id: '1',
        speciality_name: "Автоматизація та комп'ютерні наук",
    };
    axios.get.mockResolvedValue({
        data: [
            {
                faculty_id: '1',
                group_id: '530',
                group_name: 'АКм-13-2jп',
                speciality_id: '1',
            },
        ],
    });
    const resp = await addGroupsData(x, facks, specs);

    expect(resp).toEqual(z);
});
