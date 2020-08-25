import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Select, Spin, Empty, Icon } from 'antd';
import { connect } from 'dva';
import { Debounce } from 'lodash-decorators/debounce';

const { Option } = Select;

@connect(({ user: { list } }) => ({ list }))
class UserRemoteSelect extends PureComponent {
  static getDerivedStateFromProps({ value, list }) {
    return { value, list };
  }

  constructor(props) {
    super(props);
    const { list, value } = props;
    this.state = {
      list,
      value,
    };
  }

  componentWillUnmount() {
    this.fetchUser.cancel();
  }

  handleChange(value) {
    const { onChange } = this.props;
    let val = value;
    if (typeof value === 'object' && value.key) val = value.key;
    if (typeof onChange === 'function') onChange(val);
    else this.setState({ value });
  }

  @Debounce(600)
  fetchUser(q) {
    const { dispatch, location } = this.props;
    dispatch({ type: 'user/find', payload: { q, ...(location ? { location } : {}) } }).then(() =>
      this.setState({ typing: false })
    );
  }

  render() {
    const {
      placeholder = formatMessage({ id: 'common.search.select-users' }),
      styleName,
    } = this.props;
    const { value, typing, list } = this.state;
    if (list.length === 0 && value) list.push({ email: value });
    let notFoundContent = (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={formatMessage({ id: 'common.search.user.not-match' })}
      />
    );
    if (typing) {
      notFoundContent = (
        <div style={{ textAlign: 'center' }}>
          <Spin size="small" />
        </div>
      );
    } else if (list.length === 0 && !value && typing === undefined) {
      notFoundContent = (
        <div>
          <Icon type="search" /> <FormattedMessage id="common.search.user.notification" />
        </div>
      );
    }

    return (
      <Select
        value={value}
        showSearch
        allowClear
        className={styleName}
        placeholder={placeholder}
        notFoundContent={notFoundContent}
        onSearch={keyword => {
          this.setState({ typing: true }, this.fetchUser(keyword));
        }}
        onChange={v => this.handleChange(v)}
        style={{ width: '100%' }}
      >
        {list.map(({ email }) => (
          <Option key={email}>{email}</Option>
        ))}
      </Select>
    );
  }
}

export default UserRemoteSelect;
