import React, { PureComponent } from 'react';
import CollapseRow from './CollapseRow';
import styles from './index.less';

class TypeRow extends PureComponent {
  render() {
    const { data = [], onFileClick = () => {}, parentEmployeeGroup = '' } = this.props;

    return (
      <div className={styles.TypeRow}>
        {data.map((row, index) => (
          <>
            <CollapseRow
              parentEmployeeGroup={parentEmployeeGroup}
              key={`${index + 1}`}
              onFileClick={onFileClick}
              data={row}
            />
            {index + 1 < data.length && <div className={styles.divider} />}
          </>
        ))}
      </div>
    );
  }
}

export default TypeRow;
