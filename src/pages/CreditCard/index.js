import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Input, Button, Drawer, Select } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import ListCard from './components/ListCard';
import styles from './index.less';
import CardBox from './components/CardBox';

const { Search } = Input;
const { Option } = Select;
@connect(({ locations: { list, defaultLocation }, loading, creditCard }) => ({
  list,
  defaultLocation,
  loading: loading.effects['creditCard/fetch'],
  creditCard,
}))
class CreditCard extends PureComponent {
  state = { visible: false, action: 'add' };

  componentDidMount() {
    const { dispatch } = this.props;
    const status = 'ACTIVE';
    dispatch({ type: 'locations/fetch', payload: { status } });
    dispatch({ type: 'creditCard/fetch' });
  }

  componentDidUpdate(_preProps, { q: prevQ, date: prevDate = {} }) {
    const { date = {}, q } = this.state;
    const { dispatch, type = 'list' } = this.props;

    if (prevQ !== q || JSON.stringify(date) !== JSON.stringify(prevDate)) {
      dispatch({ type: 'creditCard/fetch', payload: { method: type, q, date } });
    }
  }

  showDrawer = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'creditCard/fetchItem' });
    this.setState({
      visible: true,
      action: 'add',
    });
  };

  onClose = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    dispatch({ type: 'creditCard/fetch' });
  };

  handleSearch = value => {
    this.setState({ q: value.trim() });
  };

  onClickItem = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'creditCard/fetchItem', payload: id });
    this.setState({ visible: true, action: 'update' });
  };

  onClickView = id => {
    const { dispatch } = this.props;
    dispatch({ type: 'creditCard/fetchItem', payload: id });
    this.setState({ visible: true, action: 'view' });
  };

  renderTitle = title => {
    const objTitle = [
      {
        name: 'add',
        title: formatMessage({ id: 'creditCard.title.add' }),
      },
      {
        name: 'update',
        title: formatMessage({ id: 'creditCard.title.edit' }),
      },
      {
        name: 'view',
        title: formatMessage({ id: 'creditCard.title.review' }),
      },
    ];
    const result = objTitle.find(item => item.name === title);
    return result.title || '';
  };

  handleChange = text => {
    const { dispatch } = this.props;
    dispatch({ type: 'locations/changeSelectedLocation', payload: text });
  };

  render() {
    const { visible, action } = this.state;
    const {
      list,
      defaultLocation,
      creditCard: { listCard },
      dispatch,
    } = this.props;
    const listCardByLocation = listCard.filter(item => item.location === defaultLocation);
    const titleAdd = <div className={styles.titleAdd}>{this.renderTitle(action)}</div>;

    return (
      <div className={styles.content}>
        <Row type="flex" align="middle" justify="space-between" style={{ paddingBottom: '30px' }}>
          <Col span={24} style={{ paddingBottom: '20px' }}>
            <span style={{ color: '#e67225', fontSize: '24px' }}>
              <FormattedMessage id="creditCard.page.title" /> ({listCardByLocation.length})
            </span>
          </Col>
          <Col span={8}>
            <Search
              placeholder={formatMessage({ id: 'common.search' })}
              onSearch={value => this.handleSearch(value)}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder={formatMessage({ id: 'custom.selectLocation' })}
              style={{ width: '100%' }}
              onChange={value => this.handleChange(value)}
              value={defaultLocation}
            >
              {list.map(({ _id, name }) => (
                <Option key={_id} value={_id}>
                  {name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button type="primary" icon="plus" onClick={() => this.showDrawer()}>
              <FormattedMessage id="creditCard.title.add" />
            </Button>
          </Col>
        </Row>
        <ListCard
          list={listCardByLocation.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt))}
          dispatch={dispatch}
          onClickItem={this.onClickItem}
          onClickView={this.onClickView}
        />
        <Drawer
          title={titleAdd}
          placement="right"
          onClose={this.onClose}
          visible={visible}
          width={600}
          destroyOnClose
        >
          <CardBox onCancel={() => this.onClose()} />
        </Drawer>
      </div>
    );
  }
}

export default CreditCard;
