import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function TitleUpdater() {
  const location = useLocation();

  useLayoutEffect(() => {
    const text = document.querySelector('h1')?.innerText;
    if (text != null) document.title = text;
  }, [location]);

  return null;
}
