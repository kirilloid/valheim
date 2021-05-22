import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { Icon } from './Icon';

type Article = {
  header: string;
  sections: Section[];
};

type Section = {
  header: string;
  text: string;
}

const infos: Record<string, Article> = {
  combat: {
    header: 'combat',
    sections: [
      {
        header: 'armor',
        text: `Armor is added for all equipped items. Total armor is shown on the right side of inventory ![icon/ac_bkg]. If armor is less than half of the damage, then resulting damage reduction is just: (damage - armor). Otherwise it's (damage^2 / 4*armor)`,
      },
      {
        header: 'backstab',
        text: `Backstab is actually not about attacking from behind. Instead this bonus is applied when attacking unaware opponent. Awareness is signaled by presence of an exclamation mark near opponent name. This effect cannot happen more than once per 5 minutes.`,
      }
    ],
  }
}

type ReactChildren = (string | JSX.Element)[];

function replaceWidget(
  text: string,
  regex: RegExp,
  widgetFactory: (...args: string[]) => JSX.Element,
): ReactChildren {
  let match: RegExpExecArray | null = null;
  let lastMatchIndex = 0;
  const result: ReactChildren = [];
  while (match = regex.exec(text)) {
    result.push(text.slice(lastMatchIndex, match.index));
    result.push(widgetFactory(...match));
    lastMatchIndex = match.index + match[0]!.length;
  }
  result.push(text.slice(lastMatchIndex));
  return result;
}

function replaceWidgets(
  input: ReactChildren,
  regex: RegExp,
  widgetFactory: (...args: string[]) => JSX.Element,
): ReactChildren {
  return input.flatMap(item => {
    if (typeof item !== 'string') return item;
    return replaceWidget(item, regex, widgetFactory);
  });
}

function replaceAllWidgets(input: string): ReactChildren {
  let result: ReactChildren = [input];
  result = replaceWidgets(
    result,
    /!\[(\w+)\/(\w+)\]/g,
    (_: string, type: string, id: string) => <Icon type={type} id={id} size={16} />,
  );
  result = replaceWidgets(
    result,
    /\[(.+?)\]\((.+?)\)/g,
    (_: string, path: string) => <Link to={path}></Link>,
  );
  return result;
}

export function Info() {
  const { id } = useParams<{id: string}>();
  const article = infos[id];
  if (article == null) {
    return <em>not found</em>
  }
  const hash = window.location.hash.replace(/^#/, '');
  return <article>
    <h1>{article.header}</h1>
    {article.sections.map(s => <section>
      <h1 id={s.header} className={s.header === hash ? 'active' : ''}>{s.header}</h1>
      <p>{replaceAllWidgets(s.text)}</p>
    </section>)}
  </article>
}