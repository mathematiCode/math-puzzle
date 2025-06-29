// @ts-nocheck
import Home from './pages/home';
import About from './pages/about';
import Math from './pages/math';
import Game from './pages/game';
import Layout from './components/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router';

const siteId = 123;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

// Initializing with `debug` option:
Hotjar.init(siteId, hotjarVersion, {
  debug: true,
});

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: 'aboutgame',
    element: (
      <Layout>
        <Math />
      </Layout>
    ),
  },
  {
    path: 'aboutcreator',
    element: (
      <Layout>
        <About />
      </Layout>
    ),
  },
  {
    path: 'game',
    element: (
      <Layout>
        <Game />
      </Layout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
