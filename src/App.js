import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreatePatient from "./components/PatientForm";
import Map from "./components/Map";
import Welcome from "./components/WelcomePage";

function App() {
  return (
    <Router>
      <div>
        <Navbar width="100%" />
        <Route
          exact
          path="/"
          component={Welcome}
          render={() => <Redirect to="/home" />}
        />
        <Route path="/patient" component={CreatePatient} />
        <Route path="/map" component={Map} />
      </div>
    </Router>
  );
}

export default App;
