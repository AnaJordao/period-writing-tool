import classes from './StickyBannerHeader.module.css';
import { Button, Image, Text, Title, Tooltip } from '@mantine/core';
import type { Project } from '@period-writing-tool/shared';
import { IconArrowBack } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderImage from '../../assets/placeholder-image.png';

const API_URL = import.meta.env.VITE_API_URL;
const FADE_RANGE = 100; // px of scroll, right at the banner's bottom edge, over which the crossfade happens

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function StickyBannerHeader({ currentProject }: { currentProject: Project }) {
  const [progress, setProgress] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const el = wrapperRef.current;
        if (el) {
          const { bottom } = el.getBoundingClientRect();
          // bottom === FADE_RANGE -> progress 0 (banner's bottom edge still FADE_RANGE px below viewport top)
          // bottom === 0          -> progress 1 (banner's bottom edge exactly at viewport top)
          setProgress(clamp01((FADE_RANGE - bottom) / FADE_RANGE));
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const bannerFade = 1 - progress;
  const stickyFade = progress;

  return (
    <>
      <div className={classes.wrapper} ref={wrapperRef}>
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
          <Tooltip label="Back to projects">
            <Button className={classes.backButton} onClick={() => void navigate('/')}>
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
            <Button className={classes.backButtonSmall} onClick={() => void navigate('/')}>
              <IconArrowBack size={18} />
            </Button>
          </Tooltip>

          <Title className={classes.stickyTitle} order={4}>
            {currentProject.name}
          </Title>
        </div>
      </div>
    </>
  );
}
