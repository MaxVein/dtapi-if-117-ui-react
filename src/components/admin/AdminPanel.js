import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';

import { navList } from '../../common/navUtils';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems } from './AdminNavItem';
import { Link, Route, Switch } from 'react-router-dom';
import { Block, ExitToApp, HomeOutlined } from '@material-ui/icons';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { logOut, isLogged } from '../../common/utils';

import Speciality from './speciality';
import DashboardCards from './dashboard';
import Groups from './groups';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24,
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    contentBlock: {
        position: 'relative',
        display: 'block',
        width: '100%',
        height: 'fit-content',
        padding: theme.spacing(3),
    },
}));

export default function AdminPanel({ setAuthInfo }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const logoutHandle = async () => {
        await logOut();
        const isAuth = await isLogged();
        setAuthInfo(isAuth);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="absolute"
                className={clsx(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        <Link style={{ color: 'white' }} to="/">
                            D-TESTER
                        </Link>
                    </Typography>
                    <IconButton color="inherit" onClick={logoutHandle}>
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <Link to="/">
                        <IconButton>
                            <HomeOutlined />
                        </IconButton>
                    </Link>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List className="navBar">
                    {navList.map(({ path, icon, title }, index) => (
                        <MainListItems key={index + title} path={path} icon={icon} title={title} />
                    ))}
                    <ListItem onClick={logoutHandle}>
                        <ListItemIcon>
                            <ExitToApp />
                        </ListItemIcon>
                        <ListItemText primary="Вихід" />
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <div className={classes.contentBlock}>
                    <Switch>
                        <Route path="/admin/speciality" component={Speciality} />
                    </Switch>
                    <Switch>
                        <Route path="/admin/group" component={Groups} />
                    </Switch>
                    <Switch>
                        <Route path="/admin/dashboard" component={DashboardCards} />
                    </Switch>
                </div>
            </main>
        </div>
    );
}
