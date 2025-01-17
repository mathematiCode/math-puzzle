import { useEffect } from 'react';
function useClickAway(callback) {
  useEffect(() => {
    function handleClickAway(event) {
      console.log(event);
    }
    window.addEventListener('click', handleClickAway);
    return () => {
      window.removeEventListener('click', handleClickAway);
    };
  }, [callback]);
}
export default useClickAway;
