import { useState, useEffect } from 'react';

const useResponsiveWidth = (): string => {
  const [width, setWidth] = useState('360px');
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth < 400 ? '90%' : '360px');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

export default useResponsiveWidth;
