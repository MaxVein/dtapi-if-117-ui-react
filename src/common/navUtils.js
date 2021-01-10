import {
    AccountBalance,
    CollectionsBookmark,
    Dashboard,
    Dns,
    Group,
    InsertChartSharp,
    SupervisedUserCircle,
} from '@material-ui/icons';

export const navList = [
    {
        path: '/admin/dashboard',
        icon: () => <Dashboard />,
        title: 'Головна',
    },
    {
        path: '/admin/faculties',
        icon: () => <AccountBalance />,
        title: 'Факультети',
    },
    {
        path: '/admin/group',
        icon: () => <Group />,
        title: 'Групи',
    },
    {
        path: '/admin/speciality',
        icon: () => <Dns />,
        title: 'Спеціальності',
    },
    {
        path: '/admin/subjects',
        icon: () => <CollectionsBookmark />,
        title: 'Предмети',
    },
    {
        path: '/admin/results',
        icon: () => <InsertChartSharp />,
        title: 'Результати',
    },
    {
        path: '/admin/admins',
        icon: () => <SupervisedUserCircle />,
        title: 'Адміни',
    },
];
