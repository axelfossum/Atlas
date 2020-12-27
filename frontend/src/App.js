
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";
import CreateTask from "./components/create-task.component";
import ActiveTasksList from "./components/active-tasks-list.component";

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/" exact component={ActiveTasksList} />
      <Route path="/add" component={CreateTask} />
    </Router>
  );
}

export default App;
