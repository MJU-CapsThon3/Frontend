// src/pages/Home.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, Variants } from 'framer-motion';

/* =========================================
   최상위 Container: 투명 배경, 흰색 텍스트, 스크롤 스냅 적용
============================================ */
const Container = styled.div`
  margin: 0;
  padding: 0;
  background: transparent;
  color: #ffffff;
  font-family: 'Malgun Gothic', 'Arial', sans-serif;
  max-width: 1000px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
`;

/* =========================================
   framer-motion Variants: 섹션별 다채로운 효과
============================================ */
// 1) 스케일 + 페이드인
const scaleFadeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};
// 2) 회전 + 슬라이드
const rotateSlideVariants: Variants = {
  hidden: { opacity: 0, rotate: -15, x: -50 },
  visible: {
    opacity: 1,
    rotate: 0,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};
// 3) 기울기(skew) + 페이드
const skewVariants: Variants = {
  hidden: { opacity: 0, skewY: 10, y: 30 },
  visible: {
    opacity: 1,
    skewY: 0,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};
// 4) 배경 그라디언트 애니메이션 (keyframes 활용)
const gradientKeyframes = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const GradientBackgroundSection = styled(motion.section)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  scroll-snap-align: start;

  background-size: 200% 200%;
  animation: ${gradientKeyframes} 10s ease infinite;
`;

/* =========================================
   AnimatedSection 컴포넌트: 스타일 섹션 래퍼
   - as={motion.section}을 사용, Variants는 섹션마다 다르게 지정
============================================ */
interface AnimatedSectionProps {
  children: React.ReactNode;
  variants: Variants;
  // optional custom delay or threshold
  delayChildren?: number;
}
const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  scroll-snap-align: start;
`;
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  variants,
  delayChildren,
}) => {
  // delayChildren가 있으면 stagger 처리 가능
  const containerVariants: Variants = delayChildren
    ? {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.2, delayChildren },
        },
      }
    : { hidden: {}, visible: {} };

  return (
    <SectionWrapper
      as={motion.section}
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* 내부 요소들은 각자 variants를 props로 받아 적용 */}
      {React.Children.map(children, (child) => {
        // children이 motion 요소로 wrapping 되어 있다면 variants prop 전달
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            variants,
          });
        }
        return child;
      })}
    </SectionWrapper>
  );
};

/* =========================================
   공통 styled-components (motion 태그 혼합)
============================================ */
const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;
const MainTitle = styled(motion.h1)`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 3rem;
  line-height: 3.5rem;
  margin: 0 auto 0.7rem;
  max-width: 90%;
`;
const Underline = styled(motion.div)`
  height: 4px;
  background: rgba(255, 255, 255, 0.4);
  margin: 0 auto 1.5rem;
`;
const SectionTitle = styled(motion.h2)`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;
const Paragraph = styled(motion.p)`
  font-size: 1.4rem;
  line-height: 2rem;
  margin-bottom: 1rem;
`;
const BulletList = styled.ul`
  list-style: none;
  padding-left: 0;
  li {
    margin-bottom: 0.8rem;
    font-size: 1.3rem;
    line-height: 2rem;
    padding-left: 0.7rem;
    position: relative;
  }
  li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #ffffff;
  }
`;

/* =========================================
   Design Principles 섹션 전용 스타일
============================================ */
const DesignList = styled(BulletList)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* =========================================
   Solution 섹션 전용 스타일
============================================ */
const SolutionFeatures = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;
const FeatureBox = styled(motion.div)`
  flex: 1 1 calc(50% - 1rem);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 1.2rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.4rem;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px) scale(1.03);
    transition: transform 0.3s ease;
  }
`;

/* =========================================
   Service 섹션 전용 스타일
============================================ */
const ServiceCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
const ServiceCard = styled(motion.div)`
  display: flex;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
  min-height: 180px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.3);
  }
`;
const ServicePlaceholder = styled.div`
  flex: 0 0 180px;
  background: rgba(255, 255, 255, 0.07);
  border-right: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 600;
  padding: 0.5rem;
`;
const ServiceInfo = styled.div`
  padding: 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const ServiceSubtitle = styled(motion.h3)`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  margin: 0 0 0.5rem;
`;
const ServiceDesc = styled(motion.p)`
  flex: 1;
  font-size: 1.2rem;
  line-height: 2rem;
  margin: 0 0 1rem;
`;
const ServiceTags = styled(motion.div)`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

/* =========================================
   Game 섹션 전용 스타일
============================================ */
const GameCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: space-between;
`;
const GameCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
  flex: 1 1 calc(50% - 0.6rem);
  min-width: 260px;
  display: flex;
  overflow: hidden;
  margin-bottom: 1.2rem;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.3);
  }
`;
const GamePlaceholder = styled(ServicePlaceholder)`
  flex: 0 0 120px;
`;
const GameInfo = styled.div`
  padding: 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const GameSubtitle = styled(motion.h4)`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  margin: 0 0 0.5rem;
`;
const GameDesc = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 2rem;
  margin-top: 0.5rem;
`;

/* =========================================
   섹션별 콘텐츠 데이터
============================================ */
const overviewText = `“이거냥 저거냥”은 실시간 AI 토론 플랫폼으로, 누구나 쉽고 재미있게 토론에 참여할 수 있습니다.`;
const overviewPoints = [
  '실시간 채팅 기반으로 의견 교환이 가능한 토론 공간 제공',
  'AI가 발언을 자동으로 요약·정리하고, 부적절한 표현을 필터링',
  '참관인이 투표로 승패를 결정함으로써 다양한 의견 반영',
  '랭킹·퀘스트·포인트·아이템 등 게임 요소를 도입하여 지속 참여 유도',
  '맞춤형 UI 테마 설정으로 개성 있는 토론 경험 제공',
];
const designPrinciples = [
  '직관적인 UI로 토론 흐름을 한눈에 파악',
  '부드러운 애니메이션으로 시각적 집중도 상승',
  '토론 참여자와 관람자를 분리하여 몰입감 유지',
  '투표·발언 버튼을 명확히 배치해 사용성 강화',
  '반투명 카드 디자인으로 우주 배경과 조화',
  '이모지 반응 및 댓글 기능으로 즉각적인 피드백 제공',
];
const solutionText = `AI 기술로 실시간 토론 중 발생하는 발언을 자동 요약·정리하여 건설적인 논의를 이끌어냅니다. 또한, 부적절 표현을 필터링하고, 참관인이 투표로 승패를 결정하여 투명한 진행을 돕습니다. 랭킹·퀘스트·포인트·아이템 등 다양한 게임 요소로 사용자 몰입도를 극대화합니다.`;
const solutionFeatures = [
  '발언 요약·정리',
  '부적절 표현 필터링',
  '실시간 투표 시스템',
  '랭킹·퀘스트',
];
const mainServices = [
  {
    placeholder: '토론방 리스트 화면',
    title: '토론방 리스트',
    desc: '현재 개설된 모든 토론방을 실시간으로 확인하고, 관심 있는 방에 즉시 입장할 수 있습니다.',
    tags: '#방 생성 #방 참가 #관전 모드',
  },
  {
    placeholder: '토론방 화면',
    title: '토론방',
    desc: '실시간 채팅, AI 요약, 투표 시스템을 통해 효율적이고 건설적인 토론을 진행할 수 있습니다.',
    tags: '#실시간 채팅 #AI 요약 #투표',
  },
];
const gameFeatures = [
  {
    placeholder: '퀘스트 화면',
    title: '퀘스트',
    desc: '매일 주어지는 미션을 완료하여 보상을 획득하고, 토론 참여를 독려합니다.',
  },
  {
    placeholder: '랭킹 화면',
    title: '랭킹',
    desc: '토론 성과를 바탕으로 사용자 랭킹을 제공하여 건강한 경쟁을 유도합니다.',
  },
  {
    placeholder: '상점 화면',
    title: '상점',
    desc: '모은 포인트로 아바타 스킨, 이모지 등 다양한 아이템을 구매할 수 있습니다.',
  },
  {
    placeholder: '내 정보 화면',
    title: '내 정보',
    desc: '내 토론 기록, 획득 포인트, 보유 아이템 현황을 한눈에 확인할 수 있습니다.',
  },
];

/* =========================================
   메인 컴포넌트: Home
============================================ */
const Home: React.FC = () => {
  return (
    <Container>
      {/* 1. Overview 섹션: scaleFadeVariants */}
      <AnimatedSection variants={scaleFadeVariants} delayChildren={0.3}>
        <HeaderSection>
          <MainTitle
            initial='hidden'
            whileInView='visible'
            variants={scaleFadeVariants}
            viewport={{ once: true }}
          >
            AI 기반 토론 플랫폼 “이거냥 저거냥”
          </MainTitle>
          <Underline
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: 'center' }}
            viewport={{ once: true }}
          />
        </HeaderSection>
        <SectionTitle
          initial='hidden'
          whileInView='visible'
          variants={scaleFadeVariants}
          viewport={{ once: true }}
        >
          Overview
        </SectionTitle>
        <Paragraph
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {overviewText}
        </Paragraph>
        <motion.ul
          initial='hidden'
          whileInView='visible'
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.4 },
            },
          }}
          viewport={{ once: true }}
        >
          {overviewPoints.map((point, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                listStyle: 'none',
                position: 'relative',
                paddingLeft: '1rem',
                marginBottom: '0.8rem',
              }}
              viewport={{ once: true }}
            >
              <span style={{ position: 'absolute', left: 0, color: '#fff' }}>
                •
              </span>
              {point}
            </motion.li>
          ))}
        </motion.ul>
      </AnimatedSection>

      {/* 2. Design Principles 섹션: rotateSlideVariants */}
      <AnimatedSection variants={rotateSlideVariants} delayChildren={0.2}>
        <SectionTitle
          initial='hidden'
          whileInView='visible'
          variants={rotateSlideVariants}
          viewport={{ once: true }}
        >
          Design Principles
        </SectionTitle>
        <motion.ul
          initial='hidden'
          whileInView='visible'
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          viewport={{ once: true }}
          style={{
            listStyle: 'none',
            paddingLeft: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {designPrinciples.map((item, idx) => (
            <motion.li
              key={idx}
              initial='hidden'
              whileInView='visible'
              variants={rotateSlideVariants}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              style={{
                position: 'relative',
                paddingLeft: '1rem',
                marginBottom: '0.8rem',
              }}
              viewport={{ once: true }}
            >
              <span style={{ position: 'absolute', left: 0, color: '#fff' }}>
                •
              </span>
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </AnimatedSection>

      {/* 3. Solution 섹션: skewVariants */}
      <AnimatedSection variants={skewVariants} delayChildren={0.3}>
        <SectionTitle
          initial='hidden'
          whileInView='visible'
          variants={skewVariants}
          viewport={{ once: true }}
        >
          Solution
        </SectionTitle>
        <Paragraph
          initial='hidden'
          whileInView='visible'
          variants={skewVariants}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {solutionText}
        </Paragraph>
        <SolutionFeatures>
          {solutionFeatures.map((feat, idx) => (
            <FeatureBox
              key={idx}
              initial='hidden'
              whileInView='visible'
              variants={skewVariants}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              {feat}
            </FeatureBox>
          ))}
        </SolutionFeatures>
      </AnimatedSection>

      {/* 4. Main Service 섹션: GradientBackgroundSection + rotateSlideVariants */}
      <GradientBackgroundSection
        initial='hidden'
        whileInView='visible'
        variants={rotateSlideVariants}
        viewport={{ once: true, amount: 0.3 }}
      >
        <SectionTitle
          initial='hidden'
          whileInView='visible'
          variants={rotateSlideVariants}
          viewport={{ once: true }}
        >
          Main Service
        </SectionTitle>
        <ServiceCards>
          {mainServices.map((service, idx) => (
            <ServiceCard
              key={idx}
              initial='hidden'
              whileInView='visible'
              variants={rotateSlideVariants}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <ServicePlaceholder>{service.placeholder}</ServicePlaceholder>
              <ServiceInfo>
                <ServiceSubtitle
                  initial='hidden'
                  whileInView='visible'
                  variants={rotateSlideVariants}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {service.title}
                </ServiceSubtitle>
                <ServiceDesc
                  initial='hidden'
                  whileInView='visible'
                  variants={rotateSlideVariants}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {service.desc}
                </ServiceDesc>
                <ServiceTags
                  initial='hidden'
                  whileInView='visible'
                  variants={rotateSlideVariants}
                  transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {service.tags}
                </ServiceTags>
              </ServiceInfo>
            </ServiceCard>
          ))}
        </ServiceCards>
      </GradientBackgroundSection>

      {/* 5. Gamification 섹션: scaleFadeVariants + 약간 회전 효과 */}
      <AnimatedSection variants={scaleFadeVariants} delayChildren={0.2}>
        <SectionTitle
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Gamification Factor
        </SectionTitle>
        <GameCards>
          {gameFeatures.map((game, idx) => (
            <GameCard
              key={idx}
              initial={{ opacity: 0, rotate: idx % 2 === 0 ? 10 : -10, y: 30 }}
              whileInView={{ opacity: 1, rotate: 0, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <GamePlaceholder>{game.placeholder}</GamePlaceholder>
              <GameInfo>
                <GameSubtitle
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {game.title}
                </GameSubtitle>
                <GameDesc
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  {game.desc}
                </GameDesc>
              </GameInfo>
            </GameCard>
          ))}
        </GameCards>
      </AnimatedSection>
    </Container>
  );
};

export default Home;
