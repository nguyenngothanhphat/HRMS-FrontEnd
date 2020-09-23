import React from 'react';
import styles from './index.less';

const MenuItem = (props) => {
  const { title = '', menuItem = [], selectedId = 1 } = props;
  const { handleClick } = props;

  return (
    <div className={styles.phase}>
      <h3>{title}</h3>
      {menuItem.map((item) => {
        console.log(item);
        const { id, name, quantity } = item;
        return (
          <p
            key={id}
            className={selectedId === id ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
            onClick={() => handleClick(item)}
          >
            {name} <span>({quantity})</span>
          </p>
        );
      })}
    </div>
  );
};

export default MenuItem;
