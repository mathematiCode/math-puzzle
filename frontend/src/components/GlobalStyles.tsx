import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
#root {
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  height: 100%;
}

body {
  height: 100%;
}

.App {
  font-family: sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  font-weight: 200;
}

button {
  background-color: transparent;
  border: 1px solid black;
  border-radius: 0px;
  font-size: 1.4rem;
  padding: 0px;
}
     
`;

export default GlobalStyles;
