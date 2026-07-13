import { useDisclosure } from "@mantine/hooks";
import { HeaderSearch } from "../../components/HeaderSearch/HeaderSearch";
import { CreateNewProjectModal } from "../../components/Modal/Modal";
import { getProjects } from "../../services/project.service";
import { useEffect, useState } from "react";
import type { Project } from "../../../shared/types/Project/Project";
import { CardComponent } from "../../components/CardComponent/CardComponent";
import { SimpleGrid } from "@mantine/core";

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  
  async function fetchProjects() {
    try {
      const projects = await getProjects();
      setAllProjects(projects);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    void fetchProjects();
  }, []);

  return (
    <>
      <HeaderSearch onClickBtn={open} />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {allProjects.map((project) => (
          <CardComponent key={project.id} {...project} />
        ))}
      </SimpleGrid>

      <CreateNewProjectModal
        opened={opened}
        onClose={close}
        onCreate={() => {void fetchProjects();}}
      />  
    </>
  );
}