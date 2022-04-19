import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }
  
  html {
    color: #040714;
    overflow: ${({ movieView }) => (movieView ? 'hidden' : 'visible')};
    min-height: 100vh;
  }
  
  body {
    box-sizing: border-box;
    font-family: 'Poppins', 'sans-serif';
    background: #f3f3f3;
    min-height: 100vh;
  }  
`;
