import React, {useEffect, useState} from 'react';
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const [mouseClickLocations, setMouseClickLocations] = useState<{ x: null, y: null }[]>([]);
  useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.clientX, y: ev.clientY});
    };
    const trackMouseClickLocations = (ev: any) => {
      if (localStorage.getItem("recording") !== 'false') {
        setMouseClickLocations([...mouseClickLocations, {x: ev.clientX, y: ev.clientY}])
      }
    }
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('click', trackMouseClickLocations);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('click', trackMouseClickLocations);
    };
  }, [mouseClickLocations]);
  return {mousePosition, mouseClickLocations};
};
export default useMousePosition;