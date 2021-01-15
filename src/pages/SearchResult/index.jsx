import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import iconPDF from '@/assets/pdf-2.svg';
import { Affix, Row, Col, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import TableSearch from './components/TableSearch';
import styles from './index.less';

const dummyListPeople = [
  'Krithi Priyadarshini',
  'Shipra Purohit',
  'Aditya Venkatesan',
  'Manasi Sanghani',
  'Krithi Priyadarshini',
  'Shipra Purohit',
  'Aditya Venkatesan',
];

const arr = [1, 2, 3, 4];

@connect(({ loading, searchAdvance: { result = [] } = {} }) => ({
  loading: loading.effects['searchAdvance/search'],
  result,
}))
class SearchResult extends PureComponent {
  componentDidMount() {
    const { location: { query } = {} } = this.props;
    this.handleSearch(query);
  }

  componentDidUpdate(prevProps) {
    const { location: { query } = {} } = this.props;
    const { location: { query: prevQuery } = {} } = prevProps;
    const compare = JSON.stringify(query) === JSON.stringify(prevQuery);
    if (!compare) {
      this.handleSearch(query);
    }
  }

  handleSearch = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchAdvance/search',
      payload,
    });
  };

  renderItemListPeople = (item, index) => {
    return (
      <Col span={2}>
        <div key={index} className={styles.itemListPeople}>
          <Avatar size={40} icon={<UserOutlined />} />
          <p style={{ marginTop: '10px' }}>{item}</p>
        </div>
      </Col>
    );
  };

  renderItemDocument = (item, index) => {
    return (
      <Col span={6}>
        <Row key={index} className={styles.itemListDocument} gutter={[10, 0]}>
          <Col span={5} className={styles.itemListDocument__content}>
            <img src={iconPDF} alt="iconFilePDF" />
          </Col>
          <Col span={19} className={styles.itemListDocument__content}>
            <p
              className={`${styles.itemListDocument__text} ${styles.itemListDocument__text__title}`}
            >
              Passport Copy
            </p>
            <p className={styles.itemListDocument__text} style={{ marginTop: '4px' }}>
              Aditya Venkatesan
            </p>
          </Col>
        </Row>
      </Col>
    );
  };

  render() {
    const { result = [], loading = false } = this.props;
    console.log('result', result);
    if (loading) {
      return (
        <div className={styles.viewLoading}>
          <Spin size="large" />
        </div>
      );
    }
    return (
      <PageContainer>
        <div className={styles.root}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Search Result</p>
            </div>
          </Affix>
          <div className={styles.viewContent}>
            <div className={styles.mainContent}>
              <Row gutter={[16, 16]} className={styles.block}>
                {dummyListPeople.map((item, index) => this.renderItemListPeople(item, index))}
              </Row>
              <Row gutter={[16, 16]} className={styles.block}>
                {arr.map((item, index) => this.renderItemDocument(item, index))}
              </Row>
              <div className={styles.block} style={{ padding: '28px 35px' }}>
                <TableSearch />
              </div>
              <Row gutter={[16, 16]} className={styles.block}>
                {arr.map((item, index) => this.renderItemDocument(item, index))}
              </Row>
              <div className={styles.viewSeeAll}>
                <p style={{ cursor: 'pointer' }}>See All</p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default SearchResult;
