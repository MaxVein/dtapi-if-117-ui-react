import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Route, Switch } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

function DashboardCard({ card }) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardMedia
        component="img"
        alt="Faculty"
        height="250"
        image={card.image}
        title="Faculty"
      />
      <CardContent>
        <Typography variant="h5" component="h2">
          {card.title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="large">
          <Switch>
            <Route path={card.path} component={card.component} />
          </Switch>
          Перейти
        </Button>
      </CardActions>
    </Card>
  );
}

export default DashboardCard;
