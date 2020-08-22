import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "./reset.css";
import "./nk.scss";

import pkg from "./../package.json";

import Index from "./components/Index";
// import Login from "./components/Index/login";
import Checklists from "./components/Checklists";
import EventChecklists from "./components/Checklists/Events";
import AddProducts from "./components/Devices/addProducts";
// import AddDevices from "./components/Devices/addDevices";

const AppRouter = (props) => (
  <div>
    <Router>
      <div>
        <p>N-Kizai v{pkg.version}</p>
        <Link className="nk nk_button" to="/">
          メインメニュー
        </Link>

        <Route exact path="/" component={Index} />
        {/* <Route exact path="/login" component={Login} /> */}

        <Route exact path="/checklists" component={Checklists} />
        <Route
          exact
          path="/checklists/:eventSulg"
          component={EventChecklists}
        />

        <Route exact path="/devices/add-products" component={AddProducts} />
        {/* <Route exact path="/devices/add-devices" component={AddDevices} /> */}
      </div>
    </Router>
  </div>
);

export default AppRouter;
