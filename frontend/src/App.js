
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";
import ActiveTasksList from "./components/active-tasks-list.component";
import ArchivedTasksList from "./components/archived-tasks-list.component";
import About from "./components/about.component";

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/" exact component={ActiveTasksList} />
      <Route path="/about" exact component={About} />
      <Route path="/archived" exact component={ArchivedTasksList} />
    </Router>
  );
}

export default App;
