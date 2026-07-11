import { useDisclosure } from "@mantine/hooks";
import { HeaderSearch } from "../../components/HeaderSearch/HeaderSearch";
import { CreateNewProjectModal } from "../../components/Modal/Modal";

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <HeaderSearch onClickBtn={open} />    

      <CreateNewProjectModal
        opened={opened}
        onClose={close}
      />  
    </>
  );
}