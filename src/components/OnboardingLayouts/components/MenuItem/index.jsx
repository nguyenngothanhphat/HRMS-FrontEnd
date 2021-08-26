import React from 'react';
import styles from './index.less';

const MenuItem = (props) => {
  // const { title = '', menuItem = [], selectedId = 1 } = props;
  const { name = '', component = '', quantity = 1, selectedId = 1, id = 0, link = '' } = props;
  const { handleClick } = props;
  // console.log(id);
  // const { id, name, quantity } = item;
  return (
    <div className={styles.menuWrapper}>
      {/* <h3>{title}</h3> */}

      <p
        className={selectedId === id ? `${styles.menuItem} ${styles.active}` : styles.menuItem}
        onClick={() => handleClick({ name, component, id, link })}
      >
        {name} <span>({quantity})</span>
      </p>
      {/* {menuItem.map((item) => {
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
      })} */}
    </div>
  );
};

export default MenuItem;
