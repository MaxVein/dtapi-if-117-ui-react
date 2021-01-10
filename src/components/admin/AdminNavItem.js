import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { NavLink } from 'react-router-dom';

import '../../App.css';

export const MainListItems = ({ path, icon, title }) => {
    return (
        <NavLink to={path} style={{ color: 'black' }} exact activeClassName="active">
            <ListItem>
                <ListItemIcon>{icon()}</ListItemIcon>
                <ListItemText primary={title} />
            </ListItem>
        </NavLink>
    );
};
