import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styled from 'styled-components';
import { Menu, X } from 'lucide-react';

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

const NavLink = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;

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

const MobileNavLink = styled.button`
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

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (linkName: string) => {
    console.log(`Clicked: ${linkName}`);
    setIsMobileMenuOpen(false); // Close mobile menu when link is clicked
  };

  return (
    <NavContainer>
      <NavContent>
        <Logo>Math Puzzle</Logo>

        <DesktopNav>
          <NavLink
            onClick={() => handleLinkClick('What Math is this Teaching')}
          >
            What Math is this Teaching
          </NavLink>
          <NavLink onClick={() => handleLinkClick('About Us')}>
            About Us
          </NavLink>
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
            <MobileNavLink
              onClick={() => handleLinkClick('What Math is this Teaching')}
            >
              What Math is this Teaching
            </MobileNavLink>
            <MobileNavLink onClick={() => handleLinkClick('About Us')}>
              About Us
            </MobileNavLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

export default NavBar;
