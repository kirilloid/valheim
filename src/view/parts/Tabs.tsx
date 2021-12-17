import React, { useRef, useState } from 'react';
import classNames from 'classnames';

export function Tabs({ tabs, selected }: {
  tabs: {
    title: string;
    renderer: () => JSX.Element;
  }[],
  selected: number
}) {
  const [index, setIndex] = useState(selected);
  const cache = useRef<(JSX.Element | undefined)[]>(tabs.map(() => undefined));
  return <>
    <nav className="Tabs">
      {tabs.map(({ title, renderer }, i) => <React.Fragment key={i}>
        <span
          className={classNames('Tab', { 'Tab--selected': i === index })}
          onClick={() => setIndex(i)}>
          {title}
        </span>
        <div className="Tabs__content" style={{ display: i === index ? '' : 'none'}}>{
          i === index
            ? (cache.current[index] ?? (cache.current[index] = renderer()))
            : cache.current[i]
        }</div>
      </React.Fragment>)}
    </nav>
  </>;
}
