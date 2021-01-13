import blue from '@material-ui/core/colors/blue';
import purple from '@material-ui/core/colors/purple';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import { blueGrey } from '@material-ui/core/colors';

export const themes = [
    {
        name: 'Default',
        mainColor: '#3f51b5',
        value: {
            palette: {
                primary: indigo,
            },
        },
    },
    {
        name: 'Purple',
        mainColor: '#9c27b0',
        value: {
            palette: {
                primary: purple,
            },
        },
    },
    {
        name: 'Dark Blue',
        mainColor: '#2196f3',
        value: {
            palette: {
                primary: blue,
                type: 'dark',
            },
        },
    },
    {
        name: 'Dark Pink',
        mainColor: '#e91e63',
        value: {
            palette: {
                primary: pink,
                type: 'dark',
            },
        },
    },
    {
        name: 'Dark Grey',
        mainColor: '#78909c',
        value: {
            palette: {
                primary: blueGrey,
                type: 'dark',
            },
        },
        // value: {
        //     palette: {
        //         primary: {
        //             light: '#6d6d6d',
        //             main: '#424242',
        //             dark: '#1b1b1b',
        //             contrastText: '#ffffff',
        //         },
        //         secondary: {
        //             light: '#ffffff',
        //             main: '#fafafa',
        //             dark: '#c7c7c7',
        //             contrastText: '#000000',
        //         },
        //     },
        // },
    },
];
export function ThemeToggle(name) {
    switch (name) {
        case 'Default':
            return themes[0].value;
        case 'Purple':
            return themes[1].value;
        case 'Dark Blue':
            return themes[2].value;
        case 'Dark Pink':
            return themes[3].value;
        case 'Dark Grey':
            return themes[4].value;
        default:
            return themes[0].value;
    }
}
