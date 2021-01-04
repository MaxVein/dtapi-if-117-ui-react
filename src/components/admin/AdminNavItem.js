import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { NavLink } from 'react-router-dom'

import '../../App.css'

export const MainListItems = ({ path, icon, title, handleDrawerClose }) => {
  return (
    <NavLink to={path} exact activeClassName="active">
      <ListItem onClick={() => handleDrawerClose()}>
        <ListItemIcon>{icon()}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    </NavLink>
  )
}
