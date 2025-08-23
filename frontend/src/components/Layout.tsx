import { ReactNode } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import NavBar from './NavBar';
import GlobalStyles from './GlobalStyles';

const PageContainer = styled.div`
  margin-top: 90px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <>
      <NavBar currentPath={location.pathname} />
      <PageContainer id="page-container">{children}</PageContainer>
      <GlobalStyles />
    </>
  );
};

export default Layout;
