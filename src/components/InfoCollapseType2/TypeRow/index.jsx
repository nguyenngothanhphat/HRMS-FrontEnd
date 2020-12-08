import React, { PureComponent } from 'react';
import CollapseRow from './CollapseRow';

class TypeRow extends PureComponent {
  render() {
    const { data = [], onFileClick = () => {}, parentEmployeeGroup = '' } = this.props;
    return (
      <div>
        {data.map((row, index) => (
          <CollapseRow
            parentEmployeeGroup={parentEmployeeGroup}
            key={`${index + 1}`}
            onFileClick={onFileClick}
            data={row}
          />
        ))}
      </div>
    );
  }
}

export default TypeRow;
