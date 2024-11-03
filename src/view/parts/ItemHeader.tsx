import React, { useCallback, useContext, useMemo } from 'react';

import type { GameObject } from '../../types';
import { groups } from '../../data/itemDB';
import { modLinks } from '../../mods';

import { TranslationContext, useLanguage, useRuneTranslate, useSettingsFilter } from '../../effects';
import { InlineObjectWithIcon, List, ModLinks, rangeBy } from '../helpers';
import { markdown } from '../markdown';
import { ItemIcon } from './Icon';
import { PeriodDate, seasonRange } from '../../data/seasons';

export const ItemHeader = React.memo(({ item, noIcon = false, children }: { item: GameObject, noIcon?: boolean, children?: React.ReactNode }) => {
  const translate = useContext(TranslationContext);
  const { lang } = useLanguage();
  const runeTranslate = useRuneTranslate();
  const filter = useSettingsFilter();

  const intl = React.useMemo(() => new Intl.DateTimeFormat(lang, { month: "numeric", day: "numeric" }), [lang]);
  const dateFormatter = useCallback(({ date, month }: PeriodDate) => {
    const jsDate = new Date(2020, month - 1, date);
    return intl.format(jsDate);
  }, [intl]);
  
  const group = item.group && groups[item.group];
  const groupItems = useMemo(
    () => group?.filter(filter)
      .map(e => e !== item
        ? <InlineObjectWithIcon key={e.id} id={e.id} nobr />
        : <React.Fragment key={e.id}>
          <ItemIcon item={item} useAlt={false} />
          {' '}
          {translate(e.id)}
        </React.Fragment>),
    [group, filter, item],
  );

  return <>
    {item.disabled && <div className="info" role="banner">{
      translate('ui.onlyWithCheats')
    }</div>}
    {item.season && <div className="info" role="banner">
      {markdown(translate('ui.onlyInSeason', translate(`ui.onlyInSeason.${item.season}`)))}
      {' '}
      📆{rangeBy(seasonRange[item.season], dateFormatter, ' – ')}
    </div>}
    {item.dlc ? <div className="info" role="banner">{
      markdown(translate('ui.onlyInDLC', item.dlc))
    }</div> : null}
    {item.mod ? <div className="info" role="banner" style={{ whiteSpace: 'pre-line' }}>{
      markdown(translate('ui.onlyInMod', item.mod))}
      <ModLinks {...(modLinks[item.mod] ?? {})} />
    </div> : null}
    <h1>
      {!noIcon && <>
        <ItemIcon item={item} />
        {' '}
      </>}
      {runeTranslate(item)}
      <span className="entity-type"> &ndash; {
        translate(item.type === 'object'
          ? `ui.itemSubtype.${item.subtype}`
          : item.type === 'armor'
          ? `ui.armorSlot.${item.slot}`
          : 'Food' in item
          ? `ui.itemType.food`
          : `ui.itemType.${item.type}`
        )
      }</span>
      {children}
    </h1>
    {groupItems && <div>See also: <List separator=" | ">{groupItems}</List></div>}
  </>;
});
