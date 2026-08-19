import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home/Home';
import ProjectLayout from '../pages/Project/ProjectLayout';
import { ProjectInterface } from '../pages/ProjectInterface/ProjectInterface';
import { ElementsPage } from '../pages/Element/ElementsPage';
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

        <Route path="elements" element={<ElementsPage />} />
        {/* <Route path="characters" element={<CharactersPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="species" element={<SpeciesPage />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="religions" element={<ReligionsPage />} />
          <Route path="languages" element={<LanguagesPage />} /> */}
      </Route>

      {/*        <Route path="timeline" element={<Timeline />} />

                <Route path="writing" element={<Writing />} />

                <Route path="brainstorm" element={<Brainstorm />} /> */}
      {/* </Route> */}
    </Routes>
  );
}
