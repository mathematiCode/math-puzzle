import { ReactNode } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import NavBar from './NavBar';
import GlobalStyles from './GlobalStyles';

const PageContainer = styled.div`
  margin-top: 90px;
  height: 100%;
  @media (max-width: 768px) {
    margin-top: 80px;
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
      <PageContainer>{children}</PageContainer>
      <GlobalStyles />
    </>
  );
};

export default Layout;
