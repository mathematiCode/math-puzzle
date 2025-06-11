import styled from 'styled-components';
import { RotateCw, Scissors, Combine, PanelRight } from 'lucide-react';
import { HorizontalStretchIcon } from './SvgIcons.tsx';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ToolsSection = styled.div<{ variant?: 'standalone' | 'embedded' }>`
  background: #f8f9fa;
  padding: 60px 0;
  margin: ${props =>
    props.variant === 'standalone' ? '40px 0' : '60px -20px'};
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

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 20px;
  }
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

interface MathematicalToolsProps {
  variant?: 'standalone' | 'embedded';
}

function MathematicalTools({ variant = 'embedded' }: MathematicalToolsProps) {
  return (
    <ToolsSection variant={variant}>
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
              <HorizontalStretchIcon size={40} />
            </ToolIcon>
            <ToolTitle>Double & Halve Tool</ToolTitle>
            <ToolConnection>Associative Property</ToolConnection>
            <ToolExample>4 × (2 × 3) = (4 × 2) × 3</ToolExample>
          </ToolCard>
          <ToolCard>
            <ToolIcon>
              <Scissors size={40} />
            </ToolIcon>
            <ToolTitle>Cut Tool (Coming Soon)</ToolTitle>
            <ToolConnection>Distributive Property</ToolConnection>
            <ToolExample>3(2 + 3) = 3(2) + 3(3)</ToolExample>
          </ToolCard>
          <ToolCard>
            <ToolIcon>
              <PanelRight size={40} />
            </ToolIcon>
            <ToolTitle>Combine Tool (Coming Soon)</ToolTitle>
            <ToolConnection>Distributive Property</ToolConnection>
            <ToolExample>3(2) + 3(3) = 3(2 + 3)</ToolExample>
          </ToolCard>
        </ToolsGrid>
      </Container>
    </ToolsSection>
  );
}

export default MathematicalTools;
