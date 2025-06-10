import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
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

const MathConcept = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid #007571;
`;

function Math() {
  return (
    <Container>
      <Title>What Math is this Teaching</Title>
      <Content>
        <p>
          Our puzzle games teach fundamental mathematical concepts through
          interactive problem-solving:
        </p>

        <MathConcept>
          <h3>Spatial Reasoning</h3>
          <p>
            Understanding how shapes fit together and visualizing
            transformations in space helps develop geometric thinking.
          </p>
        </MathConcept>

        <MathConcept>
          <h3>Area and Perimeter</h3>
          <p>
            By manipulating puzzle pieces, students learn about area
            conservation and how changing dimensions affects shape properties.
          </p>
        </MathConcept>

        <MathConcept>
          <h3>Problem Solving</h3>
          <p>
            Each puzzle requires logical thinking, trial and error, and
            systematic approaches to find solutions.
          </p>
        </MathConcept>
      </Content>
    </Container>
  );
}

export default Math;
