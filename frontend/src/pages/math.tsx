import styled from 'styled-components';
import MathematicalToolsGrid from '../components/MathematicalToolsGrid';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  color: #007571;
  font-size: 2.5rem;
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

interface ImageProps {
  width?: string;
}

const Image = styled.img<ImageProps>`
  width: ${props => props.width || '100%'};
  justify-self: center;
  height: auto;
  margin-top: 1rem;
`;

const FeatureTitle = styled.h3`
  color: #007571;
  margin-bottom: 1rem;
`;

function Math() {
  return (
    <Container>
      <Content>
        <Section>
          <Title>What Math Can This Help Me Learn or Teach?</Title>
          <p>
            Frectangles is designed to encourage students to recognize
            equivalent expressions visually through rectangles. Two rectangles
            with equal areas can be written as two equivalent expressions
            although in the game they are only shown visually. Each level gives
            players a set of rectangular puzzle pieces and a game board to place
            those pieces. As the levels progress, more and more mathematical
            transformations are required to turn the pieces they have into the
            pieces they need to fill board. Students can experience these
            mathematical transformations visually in the game, and can then
            build on these experiences formally and algebraically with a
            teacher.
          </p>
          <MathematicalToolsGrid />
        </Section>

        <Section>
          <SectionTitle>The Current Challenge</SectionTitle>
          <p>
            In the current version of Frectangles, students will likely approach
            the puzzles through visual estimation, eyeballing side lengths to
            determine which pieces might fit where. While they may recognize
            that the "double width, halve height" tool creates shorter, longer
            rectangles, they probably won't realize the underlying mathematical
            transformation.
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
            I'm developing two key features to promote more intentional
            mathematical reasoning:
          </p>

          <FeatureBox>
            <FeatureTitle>Grid Removal & Side Length Labels</FeatureTitle>
            <p>
              By making the grid invisible on most levels and displaying
              numerical side lengths instead, students will need to engage in
              mental math to decide which tools to use. For example, they'll
              need to calculate whether doubling a width of 4 will actually
              produce the dimensions they need, rather than relying purely on
              visual estimation.
            </p>
            <Image src="./assets/PiecesWithLabels.png" alt="No Grid Example" />
          </FeatureBox>

          <FeatureBox>
            <FeatureTitle>Strategic Tool Limitations</FeatureTitle>
            <p>
              Implementing constraints on tool usage will encourage students to
              predict the mathematical effects of each transformation before
              trying them. This will create an incentive for strategic thinking
              and help prevent the random trial-and-error approach that bypasses
              mathematical reasoning. I'm thinking of using icons similar to
              notifications to show how many uses of each tool are remaining.
            </p>
            <Image
              src="./assets/LimitsExample.png"
              alt="No Grid Example"
              width="70%"
            />
          </FeatureBox>
        </Section>

        <Section>
          <SectionTitle>Next Steps: Testing & Iteration</SectionTitle>
          <p>
            Once these features are implemented, I will do user testing with
            actual students to ensure an each level provides adequate challenge
            but is still accessible and encouraging. This user-centered approach
            will help determine the optimal level progression, action
            constraints that promote mathematical thinking while maintaining
            student enjoyment.
          </p>
          <p>
            The goal is a game that allows students to develop stronger
            intuition about equivalent expressions and properties of operations
            over time. With the support and guidance of a teacher, these
            experiences in the game can be built upon more formally with numeric
            and algebraic representations.
          </p>
        </Section>
      </Content>
    </Container>
  );
}

export default Math;
