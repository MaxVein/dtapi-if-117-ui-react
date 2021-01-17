import {
    AccountBalance,
    CollectionsBookmark,
    Dashboard,
    Dns,
    Group,
    InsertChartSharp,
    SupervisedUserCircle,
    List,
} from '@material-ui/icons';

export const navList = (t) => {
    return [
        {
            path: '/admin/dashboard',
            icon: <Dashboard />,
            title: t('menuTitles.main'),
        },
        {
            path: '/admin/faculties',
            icon: <AccountBalance />,
            title: t('menuTitles.faculties'),
        },
        {
            path: '/admin/group',
            icon: <Group />,
            title: t('menuTitles.groups'),
        },
        {
            path: '/admin/speciality',
            icon: <Dns />,
            title: t('menuTitles.specialities'),
        },
        {
            path: '/admin/subjects',
            icon: <CollectionsBookmark />,
            title: t('menuTitles.subjects'),
        },
        {
            path: '/admin/results',
            icon: <InsertChartSharp />,
            title: t('menuTitles.results'),
        },
        {
            path: '/admin/admins',
            icon: <SupervisedUserCircle />,
            title: t('menuTitles.admins'),
        },
        {
            path: '/admin/protocols',
            icon: <List />,
            title: t('menuTitles.protocol'),
        },
    ];
};
