import React from 'react';
import { Link } from 'react-router-dom';

import '../../css/TopBar.css';

import { Icon } from './Icon';
import { Search } from '../Search';
import { Settings } from './Settings';

export function TopBar() {
  return <div className="TopBar">
    <div className="TopBar__home">
      <Link to="/" className="btn btn--sm">
        <Icon id="house" size={16} alt="home" style={{ verticalAlign: 'text-bottom' }} />
      </Link>
    </div>
    <div className="TopBar__search">
      <Search />
    </div>
    <div className="TopBar__settings">
      <Settings />
    </div>
  </div>
}
