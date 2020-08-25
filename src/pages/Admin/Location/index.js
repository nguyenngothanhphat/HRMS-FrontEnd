import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Button, Icon, Table, List, Modal } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import { formatMessage } from 'umi-plugin-react/locale';
import FlagIcon from '@/components/FlagIcon';
import Financiers from './components/Finanaciers';
import Currency from '@/components/Currency';
import LayoutContent from '@/layouts/LayoutContent';
import New from './new';

@connect(({ locations: { list }, loading }) => ({
  list,
  loading: loading.models.locations,
}))
class Location extends PureComponent {
  state = { visible: false };

  columns = [
    {
      title: <strong>{formatMessage({ id: 'location.title' })}</strong>,
      dataIndex: 'name',
      key: 'name',
      render(text, { flagIcon, id }) {
        return (
          <Link className="m-1" to={`/admin/location/${id}`}>
            <FlagIcon native={flagIcon} /> {text}
          </Link>
        );
      },
    },
    {
      title: <strong>{formatMessage({ id: 'location.financiers' })}</strong>,
      dataIndex: 'financiers',
      key: 'financiers',
      render(financiers, { emailFinanciers }) {
        let positions = [];

        if (emailFinanciers) {
          positions = Object.keys(financiers).map(p => ({
            position: p,
            user: emailFinanciers[p],
          }));
        }
        return (
          emailFinanciers && (
            <List
              grid={{ lg: 1, xl: 3 }}
              dataSource={positions}
              renderItem={({ position, user }) => (
                <List.Item key={position}>
                  <Financiers position={position} user={user} />
                </List.Item>
              )}
            />
          )
        );
      },
    },
    {
      title: <strong>{formatMessage({ id: 'location.currency' })}</strong>,
      dataIndex: 'currency',
      key: 'currency',
      render(currency) {
        return <Currency currency={currency} />;
      },
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    const regexp = pathToRegexp('/admin/location/:status');
    let [, status] = regexp.exec(pathname) || ['', 'active'];
    const parse = {
      active: 'ACTIVE',
      disabled: 'INACTIVE',
    };
    status = parse[status];
    dispatch({ type: 'locations/fetch', payload: { status } });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      loading,
      list,
      location: { pathname },
    } = this.props;
    const pagination = {
      showSizeChanger: false,
      showQuickJumper: false,
      hideOnSinglePage: true,
      pageSize: 5,
      total: 0,
    };
    const { visible } = this.state;
    const regexp = pathToRegexp('/admin/location/:status');
    const [, status] = regexp.exec(pathname) || ['', 'active'];

    const content = (
      <div className="wrapper">
        <Row type="flex" align="middle" justify="end" style={{ paddingBottom: '24px' }}>
          <Col>
            <Button type="primary" onClick={this.showModal}>
              <Icon type="plus" />
              {formatMessage({ id: 'location.add-location' })}
            </Button>
          </Col>
        </Row>
        <Table
          rowKey="_id"
          {...pagination}
          loading={loading}
          columns={this.columns}
          dataSource={list}
          scroll={{ x: 'max-content' }}
        />
      </div>
    );

    return (
      <Fragment>
        <LayoutContent
          activeKey={status}
          tabs={[
            {
              name: 'Active',
              key: 'active',
              link: '/admin/location/active',
              content,
            },
            {
              name: 'Disabled',
              key: 'disabled',
              link: '/admin/location/disabled',
              content,
            },
          ]}
        />
        {visible && (
          <Modal
            title={formatMessage({ id: 'location.add', defaultMessage: 'Add location' })}
            visible={!!visible}
            footer={false}
            onCancel={this.handleCancel}
          >
            <New />
          </Modal>
        )}
      </Fragment>
    );
  }
}

export default Location;
