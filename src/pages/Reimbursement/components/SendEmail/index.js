import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Select, Spin, Empty, Icon } from 'antd';
import { connect } from 'dva';
import { Debounce } from 'lodash-decorators/debounce';

const { Option } = Select;

@connect(({ user: { list } }) => ({ list }))
class SendEmail extends PureComponent {
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

  componentDidMount() {
    const { listUser = [] } = this.props;
    this.setState({ value: listUser });
  }

  componentWillUnmount() {
    this.fetchUser.cancel();
  }

  handleChange = value => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(value);
  };

  @Debounce(600)
  fetchUser(q) {
    const { dispatch } = this.props;
    dispatch({ type: 'user/find', payload: { q } }).then(() => this.setState({ typing: false }));
  }

  render() {
    const {
      placeholder = formatMessage({ id: 'common.search.select-users' }),
      styleName,
    } = this.props;
    const { list = [], typing } = this.state;
    const { value } = this.state;
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
    } else if (!value && typing === undefined) {
      notFoundContent = (
        <div>
          <Icon type="search" />{' '}
          <FormattedMessage id="customer.project.not-found-user.pre-search" />
        </div>
      );
    }

    const children = [];
    list.forEach(item => {
      children.push(<Option key={item.email}>{item.email}</Option>);
    });

    return (
      <div>
        <Select
          showSearch
          mode="tags"
          className={styleName}
          placeholder={placeholder}
          notFoundContent={notFoundContent}
          onSearch={keyword => {
            this.setState({ typing: true }, this.fetchUser(keyword));
          }}
          onChange={this.handleChange}
          style={{ width: '100%' }}
        >
          {children}
        </Select>
      </div>
    );
  }
}

export default SendEmail;
