import classes from './StickyBannerHeader.module.css';
import { Burger, Button, Image, Text, Title, Tooltip } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import placeholderImage from '../../assets/placeholder-image.png';
import { useProject } from '../../contexts/ProjectContext';
import { useStickyHeaderProgress } from '../../hooks/useStickyHeaderProgress';

const API_URL = import.meta.env.VITE_API_URL;

export function StickyBannerHeader({ opened, toggle }: { opened: boolean; toggle: () => void }) {
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const { wrapperRef, progress } = useStickyHeaderProgress();

  const bannerFade = 1 - progress;
  const stickyFade = progress;

  const handleBack = () => {
    void navigate('/');
  };

  return (
    <>
      <div className={classes.wrapper} ref={wrapperRef} aria-label="Project sticky header">
        {currentProject.header ? (
          <Image
            src={`${API_URL}${currentProject.header}`}
            alt={currentProject.name}
            className={classes.banner}
          />
        ) : (
          <Image src={placeholderImage} alt={currentProject.name} className={classes.banner} />
        )}
        <div className={classes.overlay} />

        <div style={{ opacity: bannerFade, pointerEvents: bannerFade > 0 ? 'auto' : 'none' }}>
          <Burger className={classes.burger} opened={opened} onClick={toggle} />

          <Tooltip label="Back to projects">
            <Button
              className={classes.backButton}
              onClick={handleBack}
              aria-label="Back to projects banner"
            >
              <IconArrowBack />
            </Button>
          </Tooltip>

          <div className={classes.bigInfo}>
            <Title className={classes.title}>{currentProject.name}</Title>
            <Text className={classes.description}>{currentProject.description}</Text>
          </div>
        </div>
      </div>

      <div className={classes.stickyBar}>
        <div
          style={{
            opacity: stickyFade,
            pointerEvents: stickyFade > 0 ? 'auto' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Tooltip label="Back to projects">
            <Button
              className={classes.backButtonSmall}
              onClick={handleBack}
              aria-label="Back to projects sticky bar"
            >
              <IconArrowBack size={18} />
            </Button>
          </Tooltip>

          <Burger className={classes.burgerSmall} opened={opened} onClick={toggle} />

          <Title className={classes.stickyTitle} order={4}>
            {currentProject.name}
          </Title>
        </div>
      </div>
    </>
  );
}
