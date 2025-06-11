import styled from 'styled-components';
import MathematicalTools from '../components/MathematicalTools';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  color: #007571;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
`;

const Section = styled.section`
  margin: 2.5rem 0;
`;

const PillContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-block: 0.8rem;
`;

const Pill = styled.span`
  background-color: hsl(0, 61%, 66%);
  color: #fff;
  padding: 0.3rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
`;

const SectionTitle = styled.h2`
  color: #007571;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #007571;
  padding-bottom: 0.5rem;
`;

const FeatureBox = styled.div`
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid #007571;
`;

const FeatureTitle = styled.h3`
  color: #007571;
  margin-bottom: 1rem;
`;

const Quote = styled.blockquote`
  font-style: italic;
  color: #555;
  border-left: 3px solid #007571;
  padding-left: 20px;
  margin: 20px 0;
  background-color: #f9f9f9;
  padding: 15px 20px;
  border-radius: 0 8px 8px 0;
`;

function Math() {
  return (
    <Container>
      <Content>
        <Section>
          <Title>What Math is this Teaching?</Title>
          <PillContainer>
            <Pill>Commutative Property</Pill>
            <Pill>Associative Property</Pill>
            <Pill>Distributive Property</Pill>
          </PillContainer>
          <p>
            The puzzles require transforming the rectangles in various ways
            using the mathematical properties below. They see the
            transformations visually, and can then build on these experiences
            formally with a teacher.
          </p>
          <MathematicalTools variant="standalone" />
        </Section>
        <Section>
          <p>
            Simply presenting mathematically interesting content to students
            isn't always enough to encourage mathematical thinking. The
            challenge lies in finding the right balance between creating
            problems that are open and accessible enough to maintain student
            engagement while still promoting deep mathematical reasoning about
            the learning objectives.
          </p>
        </Section>

        <Section>
          <SectionTitle>The Current Challenge</SectionTitle>
          <p>
            In the current version of Frectangles, students will likely approach
            the puzzles through visual estimation, eyeballing side lengths and
            using intuition to determine which pieces might fit where. While
            they may recognize that the "double width, halve height" tool
            creates shorter, longer rectangles, they may not be processing the
            underlying mathematical relationships.
          </p>
          <p>
            This presents a common educational challenge: students might
            randomly try all of the available tools until something works,
            missing opportunities to engage with the mathematical concepts that
            make each transformation meaningful.
          </p>
        </Section>

        <Section>
          <SectionTitle>
            Planned Features to Encourage Mathematical Thinking
          </SectionTitle>
          <p>
            To address this challenge, I'm developing two key features designed
            to promote more intentional mathematical reasoning:
          </p>

          <FeatureBox>
            <FeatureTitle>Grid Removal & Side Length Labels</FeatureTitle>
            <p>
              By making the grid invisible on most levels and displaying
              numerical side lengths instead, students will need to engage in
              quick mental math. For example, they'll need to calculate whether
              doubling a width of 4 will actually produce the dimensions they
              need, rather than relying purely on visual estimation.
            </p>
          </FeatureBox>

          <FeatureBox>
            <FeatureTitle>Strategic Tool Limitations</FeatureTitle>
            <p>
              Implementing thoughtful constraints on tool usage will encourage
              students to predict the mathematical effects of each
              transformation before acting. This creates incentive for strategic
              thinking and helps prevent the random trial-and-error approach
              that bypasses mathematical reasoning.
            </p>
          </FeatureBox>
        </Section>

        <Section>
          <SectionTitle>Next Steps: Testing & Iteration</SectionTitle>
          <p>
            Once these features are implemented, extensive testing with actual
            students will be essential to refine the balance between challenge
            and accessibility. This user-centered approach will help determine
            the optimal combination of constraints, feedback mechanisms, and
            visual displays that promote mathematical thinking while maintaining
            student engagement.
          </p>
          <p>
            The goal is to create an educational tool that naturally guides
            students toward mathematical reasoning through thoughtful game
            design, rather than explicit instruction—making learning both
            effective and enjoyable.
          </p>
        </Section>
      </Content>
    </Container>
  );
}

export default Math;
