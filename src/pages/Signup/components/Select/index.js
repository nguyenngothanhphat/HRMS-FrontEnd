import React from 'react';
import { Select } from 'antd';

import styles from './index.less';

const { Option } = Select;

class SignupSelect extends React.Component {
  renderOption = item => {
    const { type = '' } = this.props;
    switch (type) {
      case 'currency':
        return (
          <Option key={item._id} value={`${item._id}-${item.name}` || ''}>
            {/* {`${item.name} (${item._id}) (${item.symbol})`} */}
            {`${item.name} (${item._id})`}
          </Option>
        );
      case 'country':
        return (
          <Option key={item._id} value={`${item._id}*${item.name}` || ''}>
            {/* {`${item.name} (${item._id}) (${item.symbol})`} */}
            {`${item.name}`}
          </Option>
        );
      default:
        return (
          <Option key={item} value={item || ''}>
            {item}
          </Option>
        );
    }
  };

  onSearch = value => {
    const { onChooseCurrency = () => {} } = this.props;
    onChooseCurrency(value);
  };

  render() {
    const { data = [], type = '' } = this.props;
    return (
      <div className={styles.signup_selector}>
        {type.length > 0 ? (
          <Select {...this.props} showSearch defaultValue="disabled">
            <Option value="disabled" disabled>
              {' '}
            </Option>
            {data.map(item => this.renderOption(item))}
          </Select>
        ) : (
          <Select {...this.props} defaultValue="disabled">
            <Option value="disabled" disabled>
              {' '}
            </Option>
            {data.map(item => this.renderOption(item))}
          </Select>
        )}
      </div>
    );
  }
}

export default SignupSelect;
