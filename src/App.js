import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreatePatient from "./components/PatientForm";
import Map from "./components/Map";

function App() {
  return (
    <Router>
      <div>
        <Navbar width="100%" />
        <br />
        <Route path="/patient" component={CreatePatient} />
        <Route path={"/map"} component={Map} />
      </div>
    </Router>
  );
}

export default App;
