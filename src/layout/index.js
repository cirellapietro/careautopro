import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
const Layout = () => {
  return (
    <BrowserRouter>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>
            CareAutoPro
          </Typography>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/veicoli' component={Veicoli} />
      </Switch>
    </BrowserRouter>
  );
};
export default Layout;
