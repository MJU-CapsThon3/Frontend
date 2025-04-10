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

  // 행성 데이터: 태양계 (태양, 수, 금, 지, 화, 목, 토, 천, 해)
  // size는 픽셀 단위 (상대적 크기 느낌)
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

  // 행성의 radial gradient 생성 함수
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
    // 중심: 매우 밝은 색
    const stop1 = document.createElementNS(ns, 'stop');
    stop1.setAttribute('offset', '15%');
    stop1.setAttribute('stop-color', '#ffffff');
    stop1.setAttribute('stop-opacity', '1');

    // 중간: 부드러운 전환
    const stop2 = document.createElementNS(ns, 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('stop-color', baseColor);
    stop2.setAttribute('stop-opacity', '0.8');

    // 외곽: 원래 색상
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

  // SVG 필터(그림자 효과) 생성 함수
  const createShadowFilter = (svgDefs: SVGDefsElement) => {
    const ns = 'http://www.w3.org/2000/svg';
    const filter = document.createElementNS(ns, 'filter');
    filter.setAttribute('id', 'planetShadow');
    // Gaussian Blur를 활용한 그림자 효과
    const feGaussianBlur = document.createElementNS(ns, 'feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceAlpha');
    feGaussianBlur.setAttribute('stdDeviation', '3');
    feGaussianBlur.setAttribute('result', 'blur');
    filter.appendChild(feGaussianBlur);
    // 오프셋 추가
    const feOffset = document.createElementNS(ns, 'feOffset');
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('dx', '2');
    feOffset.setAttribute('dy', '2');
    feOffset.setAttribute('result', 'offsetBlur');
    filter.appendChild(feOffset);
    // 합성하여 원래 이미지와 그림자 결합
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

  // 백그라운드 업데이트 함수
  const updateBackground = () => {
    // container와 svg를 지역 변수에 할당 후 null 체크
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

    // SVG 필터 추가 (그림자 효과)
    createShadowFilter(svgDefs as SVGDefsElement);

    // 별 생성 (기존 방식 유지)
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

    // 행성 생성: 각 행성은 그룹(<g>)으로 구성 (행성 원, 고리, 텍스트)
    const planetGroups = planetsData.map((planet, i) => {
      const group = document.createElementNS(ns, 'g');
      // 위치: 랜덤하게 배치
      const cx = getRandomX();
      const cy = getRandomY();

      // 행성 원
      const circle = document.createElementNS(ns, 'circle');
      circle.classList.add('planet');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', planet.size.toString());
      // 각 행성에 맞는 gradient 적용 및 그림자 필터 추가
      const gradientId = createPlanetGradient(
        svgDefs as SVGDefsElement,
        i,
        planet.color
      );
      circle.setAttribute('fill', `url(#${gradientId})`);
      circle.setAttribute('filter', 'url(#planetShadow)');
      group.appendChild(circle);

      // 행성 이름 레이블 (텍스트)
      const text = document.createElementNS(ns, 'text');
      text.setAttribute('x', cx);
      // 텍스트는 행성 하단에 위치 (행성 크기 + 오프셋)
      const offset = 10;
      text.setAttribute('y', String(parseFloat(cy) + planet.size + offset));
      text.textContent = planet.name;
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('style', 'text-shadow: 0 0 4px rgba(0, 0, 0, 0.8)');
      group.appendChild(text);

      // 토성 또는 고리 효과가 있는 행성: 고리 추가
      if (planet.ring) {
        const ring = document.createElementNS(ns, 'ellipse');
        ring.setAttribute('cx', cx);
        ring.setAttribute('cy', cy);
        // 고리 크기는 행성 크기의 1.6배(horizontal) 및 0.4배(vertical)
        ring.setAttribute('rx', (planet.size * 1.6).toString());
        ring.setAttribute('ry', (planet.size * 0.4).toString());
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', 'rgba(210, 166, 121, 0.8)');
        ring.setAttribute('stroke-width', '2');
        // 고리는 그룹 내부, 행성 원 뒤에 추가
        group.insertBefore(ring, circle);
      }

      return group;
    });

    // SVG 내부 초기화 후, defs와 행성 그룹, 별 요소 추가
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
