import React, { useLayoutEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const BackgroundContainer = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  overflow: hidden;
  animation: ${rotate} 180s linear infinite;
`;

const Background: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const planetsData = [
    { name: '태양', color: '#FFD700', size: 80, ring: false },
    { name: '수', color: '#A9A9A9', size: 4, ring: false },
    { name: '금', color: '#F7D38B', size: 9, ring: false },
    { name: '지', color: '#4D90FE', size: 10, ring: false },
    { name: '화', color: '#D14C32', size: 6, ring: false },
    { name: '목', color: '#D2A679', size: 30, ring: false },
    { name: '토', color: '#E3C16F', size: 26, ring: true },
    { name: '천', color: '#98D5E2', size: 14, ring: false },
    { name: '해', color: '#4B6BB7', size: 14, ring: false },
  ];

  const createPlanetGradient = (
    svgDefs: SVGDefsElement,
    index: number,
    baseColor: string
  ) => {
    const gradientId = `planet-gradient-${index}`;
    const ns = 'http://www.w3.org/2000/svg';
    const gradient = document.createElementNS(ns, 'radialGradient');
    gradient.setAttribute('id', gradientId);
    gradient.setAttribute('cx', '50%');
    gradient.setAttribute('cy', '50%');
    gradient.setAttribute('r', '50%');
    const stop1 = document.createElementNS(ns, 'stop');
    stop1.setAttribute('offset', '15%');
    stop1.setAttribute('stop-color', '#ffffff');
    stop1.setAttribute('stop-opacity', '1');
    const stop2 = document.createElementNS(ns, 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('stop-color', baseColor);
    stop2.setAttribute('stop-opacity', '0.8');
    const stop3 = document.createElementNS(ns, 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', baseColor);
    stop3.setAttribute('stop-opacity', '1');
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    svgDefs.appendChild(gradient);
    return gradientId;
  };

  const createShadowFilter = (svgDefs: SVGDefsElement) => {
    const ns = 'http://www.w3.org/2000/svg';
    const filter = document.createElementNS(ns, 'filter');
    filter.setAttribute('id', 'planetShadow');
    const feGaussianBlur = document.createElementNS(ns, 'feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceAlpha');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'blur');
    filter.appendChild(feGaussianBlur);
    const feOffset = document.createElementNS(ns, 'feOffset');
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('dx', '2');
    feOffset.setAttribute('dy', '2');
    feOffset.setAttribute('result', 'offsetBlur');
    filter.appendChild(feOffset);
    const feMerge = document.createElementNS(ns, 'feMerge');
    const feMergeNode1 = document.createElementNS(ns, 'feMergeNode');
    feMergeNode1.setAttribute('in', 'offsetBlur');
    const feMergeNode2 = document.createElementNS(ns, 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);
    svgDefs.appendChild(filter);
  };

  const updateBackground = () => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const maxSize = Math.max(window.innerWidth, window.innerHeight) * 2;
    container.style.width = `${maxSize}px`;
    container.style.height = `${maxSize}px`;
    svg.style.width = `${maxSize}px`;
    svg.style.height = `${maxSize}px`;

    const ns = 'http://www.w3.org/2000/svg';
    let svgDefs = svg.querySelector('defs');
    if (!svgDefs) {
      svgDefs = document.createElementNS(ns, 'defs');
      svg.prepend(svgDefs);
    } else {
      svgDefs.innerHTML = '';
    }

    createShadowFilter(svgDefs as SVGDefsElement);

    const getRandomX = () => (Math.random() * maxSize).toString();
    const getRandomY = () => (Math.random() * maxSize).toString();
    const randomRadius = () => (Math.random() * 0.7 + 0.6).toString();
    const starCount = Math.floor(maxSize / 2);
    const starElements = new Array(starCount).fill(null).map(() => {
      const circle = document.createElementNS(ns, 'circle');
      circle.classList.add('star');
      circle.setAttribute('cx', getRandomX());
      circle.setAttribute('cy', getRandomY());
      circle.setAttribute('r', randomRadius());
      const starDuration = Math.random() * 2 + 2;
      const starDelay = Math.random() * 2;
      circle.style.animationDuration = `${starDuration}s`;
      circle.style.animationDelay = `${starDelay}s`;
      return circle;
    });

    const planetGroups = planetsData.map((planet, i) => {
      const group = document.createElementNS(ns, 'g');
      const cx = getRandomX();
      const cy = getRandomY();
      const circle = document.createElementNS(ns, 'circle');
      circle.classList.add('planet');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', planet.size.toString());
      const gradientId = createPlanetGradient(
        svgDefs as SVGDefsElement,
        i,
        planet.color
      );
      circle.setAttribute('fill', `url(#${gradientId})`);
      circle.setAttribute('filter', 'url(#planetShadow)');
      group.appendChild(circle);
      const text = document.createElementNS(ns, 'text');
      text.setAttribute('x', cx);
      const offset = 10;
      text.setAttribute('y', String(parseFloat(cy) + planet.size + offset));

      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('style', 'text-shadow: 0 0 4px rgba(0, 0, 0, 0.8)');
      group.appendChild(text);
      if (planet.ring) {
        const ring = document.createElementNS(ns, 'ellipse');
        ring.setAttribute('cx', cx);
        ring.setAttribute('cy', cy);
        ring.setAttribute('rx', (planet.size * 1.6).toString());
        ring.setAttribute('ry', (planet.size * 0.4).toString());
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', 'rgba(210, 166, 121, 0.8)');
        ring.setAttribute('stroke-width', '2');
        group.insertBefore(ring, circle);
      }
      return group;
    });

    svg.innerHTML = '';
    svg.appendChild(svgDefs);
    planetGroups.forEach((group) => svg.appendChild(group));
    svg.append(...starElements);
  };

  useLayoutEffect(() => {
    updateBackground();
    window.addEventListener('resize', updateBackground);
    return () => {
      window.removeEventListener('resize', updateBackground);
    };
  }, []);

  return (
    <BackgroundContainer id='background' ref={containerRef}>
      <svg id='sky' ref={svgRef} />
    </BackgroundContainer>
  );
};

export default Background;
