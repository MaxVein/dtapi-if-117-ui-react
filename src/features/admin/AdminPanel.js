import React, { useEffect } from 'react';
import clsx from 'clsx';
import {
    CssBaseline,
    Divider,
    IconButton,
    Typography,
    Drawer,
    AppBar,
    Toolbar,
    Button,
    Paper,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@material-ui/core';
import { Link, Route, Switch } from 'react-router-dom';

import MenuIcon from '@material-ui/icons/Menu';
import { ChevronLeft, Block, ExitToApp, HomeOutlined, Palette } from '@material-ui/icons';

import { themes, ThemeToggle } from './themes';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { logOut, isLogged } from '../../common/utils';
import { navList } from '../../common/navUtils';
import NotFoundPage from '../../common/components/NotFoundPage/index';

import AdminsTable from './admins/index';
import Speciality from './speciality/index';
import DashboardCards from './dashboard/index';
import Subjects from './subjects/index';
import Tests from './subjects/tests/index';
import Timetable from './subjects/timetable/index';
import Groups from './groups/index';
import Protocols from './protocols/index';
import StudentsPage from '../Students/index';
import TestDetails from './subjects/tests/test-details/index';
import Questions from './subjects/tests/questions/index';
import { MainListItems } from './AdminNavItem';
import { UseLanguage } from '../../lang/LanguagesContext';

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
    ListItem: {
        padding: 0,
    },
}));

export default function AdminPanel({ setAuthInfo }) {
    const { langlist, changeLanguage, t, language, setLanguage } = UseLanguage();

    const [anchorThemeEl, setAnchorThemeEl] = React.useState(null);
    const [selectedThemeIndex, setSelectedThemeIndex] = React.useState(0);
    const [anchorLangEl, setAnchorLangEl] = React.useState(null);
    const [selectedLangIndex, setSelectedLangIndex] = React.useState(0);
    const savedTheme = localStorage.getItem('themeName');
    const [theme, setTheme] = React.useState(createMuiTheme(ThemeToggle(savedTheme)));

    const [open, setOpen] = React.useState(true);

    const [navListItems, setNavListItems] = React.useState(navList(t));
    const classes = useStyles();

    useEffect(() => {
        setTimeout(() => setNavListItems((prevVal) => (prevVal = navList(t))), 300);
        // setNavListItems((prevVal) => (prevVal = navList(t)));
    }, [language]);

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
    const handleClickThemeList = (event) => {
        setAnchorThemeEl(event.currentTarget);
    };
    const handleClickLangList = (event) => {
        setAnchorLangEl(event.currentTarget);
    };
    const handleThemesItemClick = (event, theme, index) => {
        setSelectedThemeIndex(index);
        setTheme(createMuiTheme(theme.value));
        localStorage.setItem('themeName', theme.name);
        setAnchorThemeEl(null);
    };
    const handleLangsItemClick = (event, lang, index) => {
        setSelectedLangIndex(index);
        changeLanguage(lang.name.toLowerCase());
        setLanguage(lang.name);
        localStorage.setItem('langName', lang.name);
        setAnchorLangEl(null);
    };
    const handleThemeMenuClose = () => {
        setAnchorThemeEl(null);
    };
    const handleLangsMenuClose = () => {
        setAnchorLangEl(null);
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
                        <List component="nav" aria-label="Theme settings">
                            <ListItem
                                aria-haspopup="true"
                                aria-controls="lock-menu"
                                onClick={handleClickThemeList}
                                className={classes.ListItem}
                            >
                                <IconButton style={{ color: 'white' }}>
                                    <Palette />
                                </IconButton>
                            </ListItem>
                        </List>
                        <Menu
                            id="lock-menu"
                            anchorEl={anchorThemeEl}
                            keepMounted
                            open={Boolean(anchorThemeEl)}
                            onClose={handleThemeMenuClose}
                        >
                            {themes.map((theme, index) => (
                                <MenuItem
                                    key={index}
                                    selected={index === selectedThemeIndex}
                                    onClick={(event) => handleThemesItemClick(event, theme, index)}
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

                        <List component="nav" aria-label="Language settings">
                            <ListItem
                                aria-haspopup="true"
                                aria-controls="lock-menu"
                                onClick={handleClickLangList}
                                className={classes.ListItem}
                            >
                                <Button>
                                    <ListItemText style={{ color: 'white' }} primary={language} />
                                </Button>
                            </ListItem>
                        </List>
                        <Menu
                            id="lock-menu-2"
                            anchorEl={anchorLangEl}
                            keepMounted
                            open={Boolean(anchorLangEl)}
                            onClose={handleLangsMenuClose}
                        >
                            {langlist.map((lang, index) => (
                                <MenuItem
                                    key={index}
                                    selected={index === selectedLangIndex}
                                    onClick={(event) => handleLangsItemClick(event, lang, index)}
                                >
                                    {lang.name.toUpperCase()}
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
                            <ChevronLeft />
                        </IconButton>
                    </div>
                    <Divider />
                    <List className="navBar">
                        {navListItems.map(({ path, icon, title }, index) => (
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
                                primary={t('menuTitles.exit')}
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
                            <Route path="/admin/protocols" component={Protocols} />
                            <Route path="*" component={NotFoundPage} />
                        </Switch>
                    </div>
                </main>
            </Paper>
        </ThemeProvider>
    );
}
