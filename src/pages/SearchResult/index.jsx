import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import iconPDF from '@/assets/pdf-2.svg';
import iconPNG from '@/assets/group-14-copy.svg';
import iconJPEG from '@/assets/icon-JPEG.png';
import avtDefault from '@/assets/avtDefault.jpg';
import { Affix, Row, Col, Avatar, Spin, Pagination } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { connect, history } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    searchAdvance: { result = {}, resultByCategory = [] } = {},
    user: { currentUser: { _id = '' } = {} } = {},
  }) => ({
    loading: loading.effects['searchAdvance/search'],
    loadingCategory: loading.effects['searchAdvance/searchByCategory'],
    result,
    _id,
    resultByCategory,
  }),
)
class SearchResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentDocumentPage: 1,
      currentEmployeePage: 1,
      currentResultByCategoryPage: 1,
    };
  }

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

  handleSearch = (payload = {}) => {
    const { dispatch, _id } = this.props;
    const { isSearchByCategory } = payload;
    if (isSearchByCategory) {
      dispatch({
        type: 'searchAdvance/searchByCategory',
        payload: {
          // _id,
          isSearchByCategory,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        },
      });
    } else {
      dispatch({
        type: 'searchAdvance/search',
        payload: {
          _id,
          // keySearch: payload.keySearch,
          ...payload,
          tenantId: getCurrentTenant(),
        },
      });
    }
  };

  renderItemEmployee = (item = {}, index) => {
    const { employee = {} } = item;
    return (
      <Col
        span={4}
        style={{ cursor: 'pointer' }}
        onClick={() => history.push(`/employees/employee-profile/${employee._id}`)}
      >
        <div key={index} className={styles.itemListPeople}>
          <Avatar size={50} src={item?.avatar || avtDefault} />
          <p className={styles.itemListPeople__text}>{item?.firstName}</p>
          <p className={styles.itemListPeople__text}>{employee?.title.name}</p>
          <p className={styles.itemListPeople__text}>{employee?.location.name}</p>
        </div>
      </Col>
    );
  };

  renderItemDocument = (item = {}, index) => {
    const {
      employee: { generalInfo: { firstName = '' } = {} } = {},
      attachment: { type = '' } = {},
      key: nameDocument = '',
    } = item;
    const iconFile = {
      'image/png': iconPNG,
      'application/pdf': iconPDF,
      'image/jpeg': iconJPEG,
    };
    return (
      <Col span={6}>
        <Row key={index} className={styles.itemListDocument} gutter={[10, 0]}>
          <Col span={5} className={styles.itemListDocument__content}>
            <img src={iconFile[type]} alt="icon" />
          </Col>
          <Col span={19} className={styles.itemListDocument__content}>
            <p
              className={`${styles.itemListDocument__text} ${styles.itemListDocument__text__title}`}
            >
              {nameDocument}
            </p>
            <p className={styles.itemListDocument__text} style={{ marginTop: '4px' }}>
              {firstName}
            </p>
          </Col>
        </Row>
      </Col>
    );
  };

  renderViewEmpty = (text = 'No Data') => {
    return <div className={styles.viewEmpty}>{text}</div>;
  };

  renderViewSearchByCategory = () => {
    const { resultByCategory = [] } = this.props;
    const { currentResultByCategoryPage } = this.state;
    return (
      <div className={styles.mainContent}>
        <div className={styles.block} style={{ borderBottom: 'none' }}>
          {resultByCategory.length > 0 ? (
            <>
              {' '}
              <Row style={{ marginBottom: '15px' }} gutter={[16, 16]}>
                {resultByCategory
                  .filter((doc) => doc !== null && doc?.attachment && doc?.employee?._id)
                  .slice((currentResultByCategoryPage - 1) * 10, currentResultByCategoryPage * 10)
                  .map((item, index) => this.renderItemDocument(item, index))}
              </Row>
              {resultByCategory.length > 10 && (
                <Pagination
                  showTotal={(total, range) => (
                    <span>
                      Showing{' '}
                      <b>
                        {range[0]} - {range[1]}
                      </b>{' '}
                      of {total}
                    </span>
                  )}
                  defaultCurrent={1}
                  total={resultByCategory.length}
                  onChange={(page) => this.setState({ currentResultByCategoryPage: page })}
                />
              )}
            </>
          ) : (
            this.renderViewEmpty('No Documents Search By Category')
          )}
        </div>
      </div>
    );
  };

  render() {
    const {
      loading = false,
      loadingCategory = false,
      result: { employees = [], employeeDoc = [] } = {},
      location: { query: { isSearchByCategory = false } = {} } = {},
    } = this.props;
    const { currentDocumentPage, currentEmployeePage } = this.state;
    if (loading || loadingCategory) {
      return (
        <div className={styles.viewLoading}>
          <Spin size="large" />
        </div>
      );
    }
    return (
      <PageContainer>
        <div className={styles.root}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Search Result</p>
            </div>
          </Affix>
          <div className={styles.viewContent}>
            {isSearchByCategory ? (
              this.renderViewSearchByCategory()
            ) : (
              <div className={styles.mainContent}>
                <div className={styles.block}>
                  {employees.length > 0 ? (
                    <>
                      <Row style={{ marginBottom: '15px' }} gutter={[16, 16]}>
                        {employees
                          .slice((currentEmployeePage - 1) * 10, currentEmployeePage * 10)
                          .map((item, index) => this.renderItemEmployee(item, index))}
                      </Row>
                      {employees.length > 10 && (
                        <Pagination
                          showTotal={(total, range) => (
                            <span>
                              Showing{' '}
                              <b>
                                {range[0]} - {range[1]}
                              </b>{' '}
                              of {total}
                            </span>
                          )}
                          defaultCurrent={1}
                          total={employees.length}
                          onChange={(page) => this.setState({ currentEmployeePage: page })}
                        />
                      )}
                    </>
                  ) : (
                    this.renderViewEmpty('No Employees')
                  )}
                </div>
                <div className={styles.block} style={{ borderBottom: 'none' }}>
                  {employeeDoc.length > 0 ? (
                    <>
                      <Row style={{ marginBottom: '15px' }} gutter={[16, 16]}>
                        {employeeDoc
                          .slice((currentDocumentPage - 1) * 10, currentDocumentPage * 10)
                          .map((item, index) => this.renderItemDocument(item, index))}
                      </Row>
                      {employeeDoc.length > 10 && (
                        <Pagination
                          showTotal={(total, range) => (
                            <span>
                              Showing{' '}
                              <b>
                                {range[0]} - {range[1]}
                              </b>{' '}
                              of {total}
                            </span>
                          )}
                          defaultCurrent={1}
                          total={employeeDoc.length}
                          onChange={(page) => this.setState({ currentDocumentPage: page })}
                        />
                      )}
                    </>
                  ) : (
                    this.renderViewEmpty('No Documents')
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default SearchResult;
