import React from 'react';
import styles from './index.less';

const MenuItem = (props) => {
  const { name = '', component = '', quantity = 1, selectedId = 1, id = 0, link = '' } = props;
  const { handleClick } = props;

  const className = id === 2 || id === 12 ? styles.divider : '';
  return (
    <div className={`${styles.menuWrapper} ${className}`}>
      <p
        className={selectedId === id ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
        onClick={() => handleClick({ name, component, id, link })}
      >
        {name} <span>({quantity})</span>
      </p>
    </div>
  );
};

export default MenuItem;
