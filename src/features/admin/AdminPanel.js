import React from 'react';
import clsx from 'clsx';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import { navList } from '../../common/navUtils';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems } from './AdminNavItem';
import { Link, Route, Switch } from 'react-router-dom';
import { Block, ExitToApp, HomeOutlined, Palette } from '@material-ui/icons';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { logOut, isLogged } from '../../common/utils';

import AdminsTable from './admins/index';
import Speciality from '../../components/admin/speciality';
import DashboardCards from './dashboard/index';
import Subjects from '../../components/admin/subjects';
import Tests from '../../components/admin/subjects/tests';
import Timetable from '../../components/admin/subjects/timetable';
import NotFoundPage from '../../components/NotFoundPage';
import Groups from '../../components/admin/groups';
import Protocols from '../../components/admin/protocols';
import StudentsPage from '../Students';
import TestDetails from '../../components/admin/subjects/tests/test-details';
import Questions from '../../components/admin/subjects/tests/questions';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { themes, ThemeToggle } from './themes';
import { Paper } from '@material-ui/core';

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
        padding: '0 1rem',
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
    themePreviewCircle: {
        display: 'inline-block',
        width: '.6rem',
        height: '.6rem',
        marginRight: '.5rem',
        borderRadius: '50%',
    },
    ListItemExit: {
        fontSize: '1rem',
        '&:hover': {
            fontWeight: 500,
        },
    },
}));

export default function AdminPanel({ setAuthInfo }) {
    const [open, setOpen] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const savedTheme = localStorage.getItem('themeName');
    const [theme, setTheme] = React.useState(createMuiTheme(ThemeToggle(savedTheme)));
    const classes = useStyles();

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

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuItemClick = (event, theme, index) => {
        setSelectedIndex(index);
        setTheme(createMuiTheme(theme.value));
        localStorage.setItem('themeName', theme.name);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={0} className={classes.root}>
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
                        <List component="nav" aria-label="Device settings">
                            <ListItem
                                aria-haspopup="true"
                                aria-controls="lock-menu"
                                onClick={handleClickListItem}
                            >
                                <IconButton style={{ color: 'white' }}>
                                    <Palette />
                                </IconButton>
                            </ListItem>
                        </List>
                        <Menu
                            id="lock-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {themes.map((theme, index) => (
                                <MenuItem
                                    key={index}
                                    selected={index === selectedIndex}
                                    onClick={(event) => handleMenuItemClick(event, theme, index)}
                                >
                                    <span
                                        style={{
                                            backgroundColor: theme.mainColor,
                                        }}
                                        className={classes.themePreviewCircle}
                                    />
                                    {theme.name}
                                </MenuItem>
                            ))}
                        </Menu>
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
                            <Typography
                                style={{
                                    color:
                                        theme.palette.type === 'dark'
                                            ? theme.palette.primary.light
                                            : theme.palette.primary.main,
                                }}
                                component="h3"
                                variant="h4"
                            >
                                D-TESTER
                            </Typography>
                        </Link>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List className="navBar">
                        {navList.map(({ path, icon, title }, index) => (
                            <MainListItems
                                key={index + title}
                                path={path}
                                icon={icon}
                                title={title}
                            />
                        ))}
                        <ListItem className={classes.ListItemExit} onClick={logoutHandle}>
                            <ListItemIcon>
                                <ExitToApp
                                    style={{
                                        color:
                                            theme.palette.type === 'dark'
                                                ? theme.palette.primary.light
                                                : theme.palette.primary.main,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                style={{
                                    color:
                                        theme.palette.type === 'dark'
                                            ? theme.palette.primary.light
                                            : theme.palette.primary.main,
                                }}
                                disableTypography
                                primary="Вихід"
                            />
                        </ListItem>
                    </List>
                    <Divider />
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />
                    <div className={classes.contentBlock}>
                        <Switch>
                            <Route path="/admin/speciality" component={Speciality} />
                            <Route path="/admin/group" component={Groups} />
                            <Route path="/admin/dashboard" component={DashboardCards} />
                            <Route path="/admin/admins" component={AdminsTable} />
                            <Route path="/admin/students/:id" component={StudentsPage} />
                            <Route exact path="/admin/subjects" component={Subjects} />
                            <Route exact path="/admin/subjects/tests" component={Tests}></Route>
                            <Route path="/admin/subjects/timetable" component={Timetable}></Route>
                            <Route
                                path="/admin/subjects/tests/test-detail"
                                component={TestDetails}
                            ></Route>
                            <Route
                                path="/admin/subjects/tests/questions"
                                component={Questions}
                            ></Route>
                            <Route path="*" component={NotFoundPage} />
                        </Switch>
                        <Switch>
                            <Route path="/admin/protocol" component={Protocols} />
                        </Switch>
                    </div>
                </main>
            </Paper>
        </ThemeProvider>
    );
}
