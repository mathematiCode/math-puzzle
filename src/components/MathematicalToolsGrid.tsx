import styled from 'styled-components';
import AnimatedLottieIcon from './AnimatedLottieIcon';
import rotateToolAnimation from '../assets/icons-animation/rotate-tool.json';
import horizontalStretchAnimation from '../assets/icons-animation/horizontal-stretch-tool.json';
import cutAnimation from '../assets/icons-animation/cut-tool.json';
import combineAnimation from '../assets/icons-animation/combine-tool.json';

function MathematicalToolsGrid() {
  return (
    <ToolsSection>
      <Container>
        <SectionTitle>Mathematical Tools & Connections</SectionTitle>
        <ToolsGrid>
          <ToolWrapper>
            <ToolConnection>Commutative Property</ToolConnection>
            <ToolCard>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={rotateToolAnimation}
                  size={56}
                />
              </ToolIcon>
              <ToolTitle>Rotate</ToolTitle>
              <ToolExample>3 × 5 = 5 × 3</ToolExample>
            </ToolCard>
          </ToolWrapper>

          <ToolWrapper>
            <ToolConnection>Associative Property</ToolConnection>
            <ToolCard>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={horizontalStretchAnimation}
                  size={56}
                />
              </ToolIcon>
              <ToolTitle>Double & Halve</ToolTitle>
              <ToolExample>4 × (2 × 3) = (4 × 2) × 3</ToolExample>
            </ToolCard>
          </ToolWrapper>

          <ToolWrapper>
            <ToolConnection>Distributive Property</ToolConnection>
            <ToolCard>
              <Tag>Coming Soon</Tag>
              <ToolIcon>
                <AnimatedLottieIcon animationData={cutAnimation} size={56} />
              </ToolIcon>
              <ToolTitle>Cut</ToolTitle>
              <ToolExample>3(2 + 3) = 3(2) + 3(3)</ToolExample>
            </ToolCard>
          </ToolWrapper>

          <ToolWrapper>
            <ToolConnection>Distributive Property</ToolConnection>
            <ToolCard>
              <Tag>Coming Soon</Tag>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={combineAnimation}
                  size={56}
                />
              </ToolIcon>
              <ToolTitle>Combine</ToolTitle>
              <ToolExample>3(2) + 3(3) = 3(2 + 3)</ToolExample>
            </ToolCard>
          </ToolWrapper>
        </ToolsGrid>
      </Container>
    </ToolsSection>
  );
}

const Container = styled.div`
  max-width: 1200px;
  height: fit-content;
  margin: 0 auto;
  padding: 0 20px;
  container-type: inline-size;
`;

const ToolsSection = styled.div`
  background: white;
  padding: 60px 0;
  margin: 40px 0;
  border-radius: 15px;
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

const ToolsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  justify-content: center;
  gap: 30px;
  width: 100%;
  margin: 0 auto;

  @container (max-width: 768px) {
    gap: 10px;
    flex-wrap: wrap;
    width: 100%;
  }
`;

const ToolWrapper = styled.div`
  position: relative;
  width: 250px;
  min-width: 120px;
  max-width: 300px;
  flex: 0 1 auto;

  @container (max-width: 1000px) {
    flex: 0 1 40%;
    width: unset;
  }

  @container (max-width: 768px) {
    flex: 0 1 80%;
    width: unset;
  }
`;

const ToolConnection = styled.div`
  background: hsl(0, 61%, 70%);
  color: white;
  padding: 8px 15px 20px 15px;
  border-radius: 12px 12px 0 0;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: -15px;
  z-index: 1;
  position: relative;
`;

const ToolCard = styled.div`
  width: 100%;
  background: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    transform: translateY(-3px);
  }
`;

const Tag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: hsl(185, 78%, 86%);
  color: black;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ToolIcon = styled.div`
  color: #007571;
  margin-bottom: 1rem;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
`;

const ToolTitle = styled.h4`
  color: #007571;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
`;

const ToolExample = styled.p`
  color: #888;
  font-size: 0.85rem;
  font-style: italic;
`;

export default MathematicalToolsGrid;
