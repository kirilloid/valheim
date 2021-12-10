import React, { useState } from 'react';
import classNames from 'classnames';

export function Tabs({ tabs, selected }: {
  tabs: {
    title: string;
    renderer: () => JSX.Element;
  }[],
  selected: number
}) {
  const [index, setIndex] = useState(selected);
  return <>
    <nav className="Tabs">
      {tabs.map(({ title, renderer }, i) => <React.Fragment key={i}>
        <span
          className={classNames('Tab', { 'Tab--selected': i === index })}
          onClick={() => setIndex(i)}>
          {title}
        </span>
        {i === index && <div className="Tabs__content">{renderer()}</div>}
      </React.Fragment>)}
    </nav>
  </>;
}
