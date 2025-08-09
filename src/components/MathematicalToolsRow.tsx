import styled from 'styled-components';
import AnimatedLottieIcon from './AnimatedLottieIcon';
import rotateToolAnimation from '../assets/icons-animation/rotate-tool.json';
import horizontalStretchAnimation from '../assets/icons-animation/horizontal-stretch-tool.json';
import cutAnimation from '../assets/icons-animation/cut-tool.json';
import combineAnimation from '../assets/icons-animation/combine-tool.json';

const Container = styled.div`
  max-width: 1200px;
  height: fit-content;
  margin: 0 auto;
  padding: 0 20px;
  container-type: inline-size;
`;

const ToolsSection = styled.div`
  background: transparent;
  padding: 20px 0;
  margin: 0px;
  border-radius: 0;
`;

const ToolsGrid = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-grow: 1;
  justify-content: center;
  gap: 5px;
  width: 100%;
  margin: 0 auto;
  height: fit-content;

  @container (max-width: 768px) {
    gap: 10px;
    flex-wrap: wrap;
  }
`;

const ToolWrapper = styled.div`
  position: relative;
  width: 8vw;
  min-width: 70px;
  max-width: 120px;
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

const ToolCard = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  padding: 6px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

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
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
`;

const Tag = styled.p`
  top: 5px;
  right: -10px;
  position: relative;
  background: hsl(185, 78%, 86%);
  color: black;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.6rem;
  font-weight: bold;
  text-transform: uppercase;
`;

function MathematicalToolsRow() {
  return (
    <ToolsSection>
      <Container>
        <ToolsGrid>
          <ToolWrapper>
            <ToolCard>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={rotateToolAnimation}
                  size={45}
                />
              </ToolIcon>
              <ToolTitle>Rotate</ToolTitle>
            </ToolCard>
          </ToolWrapper>
          <ToolWrapper>
            <ToolCard>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={horizontalStretchAnimation}
                  size={45}
                />
              </ToolIcon>
              <ToolTitle>Double & Halve</ToolTitle>
            </ToolCard>
          </ToolWrapper>
          <ToolWrapper>
            <ToolCard>
              <Tag>Coming Soon</Tag>
              <ToolIcon>
                <AnimatedLottieIcon animationData={cutAnimation} size={45} />
              </ToolIcon>
              <ToolTitle>Cut</ToolTitle>
            </ToolCard>
          </ToolWrapper>
          <ToolWrapper>
            <ToolCard>
              <Tag>Coming Soon</Tag>
              <ToolIcon>
                <AnimatedLottieIcon
                  animationData={combineAnimation}
                  size={45}
                />
              </ToolIcon>
              <ToolTitle>Combine</ToolTitle>
            </ToolCard>
          </ToolWrapper>
        </ToolsGrid>
      </Container>
    </ToolsSection>
  );
}

export default MathematicalToolsRow;
