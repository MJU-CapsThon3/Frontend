// src/pages/Home.tsx
import React from 'react';
import styled from 'styled-components';

/* =========================================
   최상위 Container: 투명 배경, 흰색 텍스트, 스크롤 스냅 적용
   + 스크롤바 숨김 추가
============================================ */
const Container = styled.div`
  margin: 0;
  padding: 0;
  background: transparent;
  color: #ffffff;
  font-family: 'Malgun Gothic', 'Arial', sans-serif;

  max-width: 1000px;
  overflow-y: auto;

  /* 스크롤바 숨김 (WebKit 기반 브라우저) */
  &::-webkit-scrollbar {
    display: none;
  }
  /* IE, Edge */
  -ms-overflow-style: none;
  /* Firefox */
  scrollbar-width: none;

  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
`;

/* =========================================
   AnimatedSection 컴포넌트
   - 애니메이션 제거: 상시 표시만 함
============================================ */
interface AnimatedSectionProps {
  children: React.ReactNode;
}

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  scroll-snap-align: start;
  opacity: 1; /* 항상 표시 */
`;

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children }) => {
  return <SectionWrapper>{children}</SectionWrapper>;
};

/* =========================================
   공통 스타일 정의
============================================ */
const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const MainTitle = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 3rem;
  line-height: 3.5rem;
  margin: 0 auto 0.7rem;
  max-width: 90%;
`;

const Underline = styled.div`
  width: 60%;
  height: 4px;
  background: rgba(255, 255, 255, 0.4);
  margin: 0 auto 1.5rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
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
  }
`;

/* =========================================
   Design Principles 섹션 전용 스타일
============================================ */
const DesignList = styled(BulletList)`
  display: flex;
  flex-direction: column;
  align-items: center;

  li {
    color: #ffffff;
  }
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

const FeatureBox = styled.div`
  flex: 1 1 calc(50% - 1rem);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 1.2rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
`;

/* =========================================
   Service 섹션 전용 스타일
============================================ */
const ServiceCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ServiceCard = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
  min-height: 180px;
`;

const ServicePlaceholder = styled.div`
  flex: 0 0 180px;
  background: rgba(255, 255, 255, 0.07);
  border-right: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.5rem;
`;

const ServiceInfo = styled.div`
  padding: 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ServiceSubtitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  margin: 0 0 0.5rem;
`;

const ServiceDesc = styled.p`
  flex: 1;
  font-size: 1.3rem;
  line-height: 2rem;
  margin: 0 0 1rem;
`;

const ServiceTags = styled.div`
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

const GameCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
  flex: 1 1 calc(50% - 0.6rem);
  min-width: 260px;
  display: flex;
  overflow: hidden;
  margin-bottom: 1.2rem;
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

const GameSubtitle = styled.h4`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.6rem;
  margin: 0 0 0.5rem;
`;

const GameDesc = styled.p`
  font-size: 1.3rem;
  line-height: 2rem;
  margin-top: 0.5rem;
`;

/* =========================================
   섹션별 콘텐츠 데이터
============================================ */
// Overview
const overviewText = `“이거냥 저거냥”은 실시간 AI 토론 플랫폼으로, 누구나 쉽고 재미있게 토론에 참여할 수 있습니다.`;
const overviewPoints = [
  '실시간 채팅 기반으로 의견 교환이 가능한 토론 공간 제공',
  'AI가 발언을 자동으로 요약·정리하고, 부적절한 표현을 필터링',
  '참관인이 투표로 승패를 결정함으로써 다양한 의견 반영',
  '랭킹·퀘스트·포인트·아이템 등 게임 요소를 도입하여 지속 참여 유도',
  '맞춤형 UI 테마 설정으로 개성 있는 토론 경험 제공',
];

// Design Principles
const designPrinciples = [
  '직관적인 UI로 토론 흐름을 한눈에 파악',
  '부드러운 애니메이션으로 시각적 집중도 상승',
  '토론 참여자와 관람자를 분리하여 몰입감 유지',
  '투표·발언 버튼을 명확히 배치해 사용성 강화',
  '반투명 카드 디자인으로 우주 배경과 조화',
  '이모지 반응 및 댓글 기능으로 즉각적인 피드백 제공',
];

// Solution
const solutionText = `AI 기술로 실시간 토론 중 발생하는 발언을 자동 요약·정리하여 건설적인 논의를 이끌어냅니다. 또한, 부적절 표현을 필터링하고, 참관인이 투표로 승패를 결정하여 투명한 진행을 돕습니다. 랭킹·퀘스트·포인트·아이템 등 다양한 게임 요소로 사용자 몰입도를 극대화합니다.`;
const solutionFeatures = [
  '발언 요약·정리',
  '부적절 표현 필터링',
  '실시간 투표 시스템',
  '랭킹·퀘스트',
];

// Main Service
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

// Gamification
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
      {/* Overview 섹션 */}
      <AnimatedSection>
        <HeaderSection>
          <MainTitle>AI 기반 토론 플랫폼 “이거냥 저거냥”</MainTitle>
          <Underline />
        </HeaderSection>
        <SectionTitle>Overview</SectionTitle>
        <Paragraph>{overviewText}</Paragraph>
        <BulletList>
          {overviewPoints.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </BulletList>
      </AnimatedSection>

      {/* Design Principles 섹션 */}
      <AnimatedSection>
        <SectionTitle>Design Principles</SectionTitle>
        <DesignList>
          {designPrinciples.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </DesignList>
      </AnimatedSection>

      {/* Solution 섹션 */}
      <AnimatedSection>
        <SectionTitle>Solution</SectionTitle>
        <Paragraph>{solutionText}</Paragraph>
        <SolutionFeatures>
          {solutionFeatures.map((feat, idx) => (
            <FeatureBox key={idx}>{feat}</FeatureBox>
          ))}
        </SolutionFeatures>
      </AnimatedSection>

      {/* Main Service 섹션 */}
      <AnimatedSection>
        <SectionTitle>▼ Main Service ▼</SectionTitle>
        <ServiceCards>
          {mainServices.map((service, idx) => (
            <ServiceCard key={idx}>
              <ServicePlaceholder>{service.placeholder}</ServicePlaceholder>
              <ServiceInfo>
                <ServiceSubtitle>{service.title}</ServiceSubtitle>
                <ServiceDesc>{service.desc}</ServiceDesc>
                <ServiceTags>{service.tags}</ServiceTags>
              </ServiceInfo>
            </ServiceCard>
          ))}
        </ServiceCards>
      </AnimatedSection>

      {/* Gamification 섹션 */}
      <AnimatedSection>
        <SectionTitle>▼ Gamification Factor ▼</SectionTitle>
        <GameCards>
          {gameFeatures.map((game, idx) => (
            <GameCard key={idx}>
              <GamePlaceholder>{game.placeholder}</GamePlaceholder>
              <GameInfo>
                <GameSubtitle>{game.title}</GameSubtitle>
                <GameDesc>{game.desc}</GameDesc>
              </GameInfo>
            </GameCard>
          ))}
        </GameCards>
      </AnimatedSection>
    </Container>
  );
};

export default Home;
