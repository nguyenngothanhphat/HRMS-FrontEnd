import React from 'react';
import styles from './index.less';

const CellMenu = ({ visible, x, y, onClick = () => {} }) => {
  if (!visible) return null;
  return (
    <ul className={styles.CellMenu} style={{ left: x, top: y }}>
      <li onClick={onClick}>View in Daily mode</li>
    </ul>
  );
};

export default CellMenu;
