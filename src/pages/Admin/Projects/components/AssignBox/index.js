import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Select, Spin, Empty, Icon, List, Skeleton, Avatar } from 'antd';
import { connect } from 'dva';
import { Debounce } from 'lodash-decorators/debounce';
import styles from './index.less';
import userAvatar from '@/assets/user.png';

const { Option } = Select;

@connect(({ user: { list } }) => ({ list }))
class AssignBox extends PureComponent {
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

  deduplicate = arr => {
    const set = new Set(arr);
    return [...set];
  };

  handleChange = value => {
    const { onChange } = this.props;
    const { value: stateValue = [] } = this.state;
    let tempList = stateValue;
    tempList.unshift(value);
    tempList = this.deduplicate(tempList);
    if (typeof onChange === 'function') onChange(tempList);
    this.setState({ value: tempList });
  };

  deleteItem = item => {
    const { value } = this.state;
    const { onChange } = this.props;
    const listUser = value.filter(i => i !== item);
    if (typeof onChange === 'function') onChange(listUser);
    this.setState({ value: listUser });
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
      disabled,
    } = this.props;
    const { list = [], typing } = this.state;
    const { value } = this.state;
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
    } else if (!value && typing === undefined) {
      notFoundContent = (
        <div>
          <Icon type="search" />{' '}
          <FormattedMessage id="customer.project.not-found-user.pre-search" />
        </div>
      );
    }

    return (
      <div>
        <Select
          disabled={disabled}
          showSearch
          className={styleName}
          placeholder={placeholder}
          notFoundContent={notFoundContent}
          onSearch={keyword => {
            this.setState({ typing: true }, this.fetchUser(keyword));
          }}
          onChange={this.handleChange}
          style={{ width: '100%' }}
          onSelect={this.onSelect}
        >
          {list.map(({ email }) => {
            if (email.length !== 0) {
              return <Option key={email}>{email}</Option>;
            }
            return '';
          })}
        </Select>

        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={value}
          renderItem={items => (
            <List.Item
              actions={[
                <span className={styles.btnDel}>
                  <Icon
                    type="delete"
                    theme="filled"
                    style={{ fontSize: '22px' }}
                    onClick={() => this.deleteItem(items)}
                  />
                </span>,
              ]}
            >
              <Skeleton avatar title={false} loading={items.loading} active>
                <List.Item.Meta avatar={<Avatar src={userAvatar} />} title={<span>{items}</span>} />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default AssignBox;
