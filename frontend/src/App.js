import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/layout/Main";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddTask from "./pages/AddTask";
import AddTeamMember from "./pages/AddTeam";
import AddProject from "./pages/AddProject";
import Team from "./pages/Team";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import ProjectDetail from "./pages/ProjectDetail";
import { useAuthContext } from "./hooks/useAuthContext";

import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

function App() {
  const { user } = useAuthContext();

  return (
    <Routes>
      <Route element={<Main />}>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/login" />} />
        <Route path="/tasks/add" element={user ? <AddTask /> : <Navigate to="/login" />} />
        <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/projects/add" element={user ? <AddProject /> : <Navigate to="/login" />} />
        <Route path="/projects/:id" element={user ? <ProjectDetail /> : <Navigate to="/login" />} /> 
        <Route path="/my-team" element={user ? <Team /> : <Navigate to="/login" />} />
        <Route path="/my-team/new" element={user ? <AddTeamMember /> : <Navigate to="/login" />} />
        <Route exact path="/profile" component={Profile} />
      </Route>
      
      //Login route
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;