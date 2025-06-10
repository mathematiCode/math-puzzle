import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styled from 'styled-components';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #007571;
  z-index: 1000;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;

  @media (max-width: 768px) {
    height: 60px;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button<{ $isActive?: boolean }>`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;

  ${props =>
    props.$isActive &&
    `
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
  `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #007571;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MobileNavLink = styled.button<{ $isActive?: boolean }>`
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 15px 20px;
  border-radius: 8px;
  text-align: left;
  transition: all 0.3s ease;
  position: relative;

  ${props =>
    props.$isActive &&
    `
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
    
    &::before {
      content: '●';
      margin-right: 10px;
      color: white;
    }
  `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

interface NavBarProps {
  currentPath: string;
}

const NavBar = ({ currentPath }: NavBarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (path: string) => {
    if (path !== currentPath) {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/math', label: 'What Math is this Teaching' },
    { path: '/about', label: 'About The Creator' },
    { path: '/game', label: 'Play The Game' },
  ];

  return (
    <NavContainer>
      <NavContent>
        <Logo onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          Frectangles
        </Logo>

        <DesktopNav>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              onClick={() => handleLinkClick(item.path)}
              $isActive={item.path === currentPath}
            >
              {item.label}
            </NavLink>
          ))}
        </DesktopNav>

        <MobileMenuButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </NavContent>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {navItems.map(item => (
              <MobileNavLink
                key={item.path}
                onClick={() => handleLinkClick(item.path)}
                $isActive={item.path === currentPath}
              >
                {item.label}
              </MobileNavLink>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

export default NavBar;
