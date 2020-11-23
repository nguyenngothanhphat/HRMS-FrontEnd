import React, { PureComponent } from 'react';
import CollapseRow from './CollapseRow';

class TypeRow extends PureComponent {
  render() {
    const { data = [], onFileClick = () => {} } = this.props;
    return (
      <div>
        {data.map((row, index) => (
          <CollapseRow key={`${index + 1}`} onFileClick={onFileClick} data={row} />
        ))}
      </div>
    );
  }
}

export default TypeRow;
