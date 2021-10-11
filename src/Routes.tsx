import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import CreateAppointment from './pages/CreateAppointment'
import PreAppointment from './pages/PreAppointment'
import Appointment from './pages/Appointment'

const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={CreateAppointment} />
    <Route
      exact
      path="/:profile/pre-appointment/:roomName"
      component={PreAppointment}
    />
    <Route
      exact
      path="/:profile/appointment/:roomName"
      component={Appointment}
    />

    <Route path="*" component={() => <Redirect to={{ pathname: '/' }} />} />
  </Switch>
)

export default Routes
