// router/AppRouter.tsx

import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home/Home';
import ProjectLayout from '../pages/Project/ProjectLayout';
import { ProjectInterface } from '../pages/ProjectInterface/ProjectInterface';
// import Dashboard from "../pages/Dashboard/Dashboard";
// import Elements from "../pages/Elements/Elements";
// import Timeline from "../pages/Timeline/Timeline";
// import Writing from "../pages/Writing/Writing";
// import Brainstorm from "../pages/Brainstorm/Brainstorm";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/projects/:projectId" element={<ProjectLayout />}>
        <Route index element={<ProjectInterface />} />

        {/*        <Route path="elements" element={<Elements />} />

                <Route path="timeline" element={<Timeline />} />

                <Route path="writing" element={<Writing />} />

                <Route path="brainstorm" element={<Brainstorm />} /> */}
      </Route>
    </Routes>
  );
}
