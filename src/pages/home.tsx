// @ts-nocheck

import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { RotateCw, Maximize2, Scissors, Link } from 'lucide-react';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, #007571 0%, #00a396 100%);
  color: white;
  margin: -90px -20px 60px -20px;
  padding-top: 150px;

  @media (max-width: 768px) {
    margin-top: -80px;
    padding-top: 120px;
    padding: 120px 20px 60px;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const PlayButton = styled.button`
  background: white;
  color: #007571;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Section = styled.section`
  margin: 60px 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #007571;
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 40px 0;
`;

const BenefitCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #007571;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BenefitTitle = styled.h3`
  color: #007571;
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

const BenefitText = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
`;

const ToolsSection = styled.div`
  background: #f8f9fa;
  padding: 60px 0;
  margin: 60px -20px;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ToolCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const ToolIcon = styled.div`
  color: #007571;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const ToolTitle = styled.h4`
  color: #007571;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ToolConnection = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ToolExample = styled.p`
  color: #888;
  font-size: 0.85rem;
  font-style: italic;
`;

const CallToAction = styled.div`
  background: linear-gradient(135deg, #007571 0%, #00a396 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
  margin: 60px -20px -90px -20px;

  @media (max-width: 768px) {
    margin-bottom: -80px;
  }
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

function Home() {
  const navigate = useNavigate();

  const handlePlayGame = () => {
    navigate('/game');
  };

  return (
    <div>
      <HeroSection>
        <Container>
          <Title>Frectangles</Title>
          <Subtitle>Where Math Meets Puzzle-Solving Fun</Subtitle>
          <PlayButton onClick={handlePlayGame}>Play Game</PlayButton>
        </Container>
      </HeroSection>

      <Container>
        <Section>
          <SectionTitle>Perfect for Students & Teachers</SectionTitle>
          <BenefitsGrid>
            <BenefitCard>
              <BenefitTitle>Build Number Intuition</BenefitTitle>
              <BenefitText>
                Students practice estimating the magnitude of numbers while
                manipulating puzzle pieces, developing a deeper understanding of
                numerical relationships.
              </BenefitText>
            </BenefitCard>
            <BenefitCard>
              <BenefitTitle>Visualize Math Properties</BenefitTitle>
              <BenefitText>
                Make abstract mathematical concepts concrete through hands-on
                manipulation of shapes and sizes, connecting operations to
                visual representations.
              </BenefitText>
            </BenefitCard>
            <BenefitCard>
              <BenefitTitle>Classroom Ready</BenefitTitle>
              <BenefitText>
                Teachers can use these informal experiences as launching points
                for deeper discussions about mathematical expressions and
                equivalent operations.
              </BenefitText>
            </BenefitCard>
          </BenefitsGrid>
        </Section>
      </Container>

      <ToolsSection>
        <Container>
          <SectionTitle>Mathematical Tools & Connections</SectionTitle>
          <ToolsGrid>
            <ToolCard>
              <ToolIcon>
                <RotateCw size={40} />
              </ToolIcon>
              <ToolTitle>Rotation Tool</ToolTitle>
              <ToolConnection>Commutative Property</ToolConnection>
              <ToolExample>3 × 5 = 5 × 3</ToolExample>
            </ToolCard>
            <ToolCard>
              <ToolIcon>
                <Maximize2 size={40} />
              </ToolIcon>
              <ToolTitle>Double & Halve Tool</ToolTitle>
              <ToolConnection>Associative Property</ToolConnection>
              <ToolExample>4 × (2 × 3) = (4 × 2) × 3</ToolExample>
            </ToolCard>
            <ToolCard>
              <ToolIcon>
                <Scissors size={40} />
              </ToolIcon>
              <ToolTitle>Cut Tool</ToolTitle>
              <ToolConnection>Distributive Property</ToolConnection>
              <ToolExample>3(2 + 3) = 3(2) + 3(3)</ToolExample>
            </ToolCard>
            <ToolCard>
              <ToolIcon>
                <Link size={40} />
              </ToolIcon>
              <ToolTitle>Glue Tool</ToolTitle>
              <ToolConnection>Distributive Property</ToolConnection>
              <ToolExample>3(2) + 3(3) = 3(2 + 3)</ToolExample>
            </ToolCard>
          </ToolsGrid>
        </Container>
      </ToolsSection>

      <CallToAction>
        <Container>
          <CTATitle>Ready to Transform Math Learning?</CTATitle>
          <CTAText>
            Start building mathematical intuition through interactive puzzle
            solving
          </CTAText>
          <PlayButton onClick={handlePlayGame}>Start Playing Now</PlayButton>
        </Container>
      </CallToAction>
    </div>
  );
}

export default Home;
