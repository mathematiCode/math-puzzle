import styled from 'styled-components';
import AnimatedLottieIcon from './AnimatedLottieIcon';
import rotateToolAnimation from '../assets/icons-animation/rotate-tool.json';
import horizontalStretchAnimation from '../assets/icons-animation/horizontal-stretch-tool.json';
//import verticalStretchAnimation from '../assets/icons-animation/vertical-stretch-tool.json';
import cutAnimation from '../assets/icons-animation/cut-tool.json';
import combineAnimation from '../assets/icons-animation/combine-tool.json';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  container-type: inline-size;
`;

const ToolsSection = styled.div<{ variant?: 'standalone' | 'embedded' }>`
  background: ${props =>
    props.variant === 'standalone' ? 'white' : 'transparent'};
  padding: ${props => (props.variant === 'embedded' ? '20px 0' : '60px 0')};
  margin: ${props =>
    props.variant === 'standalone' ? '40px 0' : '10px -20px'};
  border-radius: ${props => (props.variant === 'standalone' ? '15px' : '0')};
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

const ToolsGrid = styled.div<{ variant?: 'standalone' | 'embedded' }>`
  display: flex;
  flex-wrap: ${props => (props.variant === 'embedded' ? 'nowrap' : 'wrap')};
  justify-content: center;
  gap: ${props => (props.variant === 'embedded' ? '5px' : '30px')};
  width: ${props => (props.variant === 'embedded' ? '100%' : '100%')};
  margin: 0 auto;

  @container (max-width: 768px) {
    gap: 10px;
    flex-wrap: wrap;
    width: 100%;
  }
`;

const ToolWrapper = styled.div<{ variant?: 'standalone' | 'embedded' }>`
  position: relative;
  width: ${props => (props.variant === 'embedded' ? '8vw' : '250px')};
  min-width: ${props => (props.variant === 'embedded' ? '70px' : '120px')};
  max-width: ${props => (props.variant === 'embedded' ? '120px' : '250px')};
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

const ToolCard = styled.div<{ variant?: 'standalone' | 'embedded' }>`
  width: 100%;
  height: ${props => (props.variant === 'embedded' ? '100%' : '')};
  background: white;
  padding: ${props => (props.variant === 'embedded' ? '6px' : '25px')};
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
  ${props =>
    props.variant === 'embedded'
      ? `
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
  `
      : ''}
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

const ToolTitle = styled.h4<{ variant?: 'standalone' | 'embedded' }>`
  color: #007571;
  font-size: ${props => (props.variant === 'embedded' ? '0.85rem' : '1.2rem')};
  margin-bottom: 0.3rem;
`;

const ToolExample = styled.p<{ variant?: 'standalone' | 'embedded' }>`
  color: #888;
  font-size: ${props => (props.variant === 'embedded' ? '0.7rem' : '0.85rem')};
  font-style: italic;
`;

interface MathematicalToolsProps {
  variant?: 'standalone' | 'embedded';
}

function MathematicalTools({ variant = 'embedded' }: MathematicalToolsProps) {
  return (
    <ToolsSection variant={variant}>
      <Container>
        {variant !== 'embedded' && (
          <SectionTitle>Mathematical Tools & Connections</SectionTitle>
        )}
        <ToolsGrid variant={variant}>
          <ToolWrapper variant={variant}>
            {variant !== 'embedded' && (
              <ToolConnection>Commutative Property</ToolConnection>
            )}
            <ToolCard variant={variant}>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={rotateToolAnimation}
                  size={variant === 'embedded' ? 45 : 56}
                />
              </ToolIcon>
              <ToolTitle variant={variant}>Rotation Tool</ToolTitle>
              {variant !== 'embedded' && (
                <ToolExample variant={variant}>3 × 5 = 5 × 3</ToolExample>
              )}
            </ToolCard>
          </ToolWrapper>
          <ToolWrapper variant={variant}>
            {variant !== 'embedded' && (
              <ToolConnection>Associative Property</ToolConnection>
            )}
            <ToolCard variant={variant}>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={horizontalStretchAnimation}
                  size={variant === 'embedded' ? 45 : 56}
                />
              </ToolIcon>
              <ToolTitle variant={variant}>Double & Halve</ToolTitle>
              {variant !== 'embedded' && (
                <ToolExample variant={variant}>
                  4 × (2 × 3) = (4 × 2) × 3
                </ToolExample>
              )}
            </ToolCard>
          </ToolWrapper>
          <ToolWrapper variant={variant}>
            {variant !== 'embedded' && (
              <ToolConnection>Distributive Property</ToolConnection>
            )}
            <ToolCard variant={variant}>
              <Tag>Coming Soon</Tag>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={cutAnimation}
                  size={variant === 'embedded' ? 45 : 56}
                />
              </ToolIcon>
              <ToolTitle variant={variant}>Cut Tool</ToolTitle>
              {variant !== 'embedded' && (
                <ToolExample variant={variant}>
                  3(2 + 3) = 3(2) + 3(3)
                </ToolExample>
              )}
            </ToolCard>
          </ToolWrapper>
          <ToolWrapper variant={variant}>
            {variant !== 'embedded' && (
              <ToolConnection>Distributive Property</ToolConnection>
            )}
            <ToolCard variant={variant}>
              <Tag>Coming Soon</Tag>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={combineAnimation}
                  size={variant === 'embedded' ? 45 : 56}
                />
              </ToolIcon>
              <ToolTitle variant={variant}>Combine Tool</ToolTitle>
              {variant !== 'embedded' && (
                <ToolExample variant={variant}>
                  3(2) + 3(3) = 3(2 + 3)
                </ToolExample>
              )}
            </ToolCard>
          </ToolWrapper>
        </ToolsGrid>
      </Container>
    </ToolsSection>
  );
}

export default MathematicalTools;
