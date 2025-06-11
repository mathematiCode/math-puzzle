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
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
      max-width: 300px;
      height: 300px;
      margin: 0 auto 1rem auto;
    }
  }

  p {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    font-size: 1.2rem;
  }
`;

function About() {
  return (
    <Container>
      <Title>About The Creator</Title>
      <Content>
        <img src="./assets/headshot.png" alt="Image of Julianna" />
        <p>
          Hi I'm Julianna, a Front-End Software Engineer and former math
          teacher. I've taught math for 5 years (2019-2024), ranging from 6th
          grade to 9th grade, as well as math intervention. As a teacher, I
          loved crafting creative and engaging lessons and interactive tools
          that build on students prior knowledge and get them where they need to
          be. I was inspired to build this game after playing multiplication
          games like Stick and Split and Number Hive and wanting something
          similarly fun and educational for middle school students. I'm inspired
          by math games that make the MATH itself the fun part of the game. I am
          currently looking for a frontend development role, ideally at an
          edtech company.
        </p>
      </Content>
    </Container>
  );
}

export default About;
