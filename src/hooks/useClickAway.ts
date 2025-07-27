// Not currently in use YET

import { useEffect } from 'react';
function useClickAway(callback: () => void) {
  useEffect(() => {
    function handleClickAway(event: MouseEvent) {
      console.log(event);
    }
    window.addEventListener('click', handleClickAway);
    return () => {
      window.removeEventListener('click', handleClickAway);
    };
  }, [callback]);
}
export default useClickAway;
