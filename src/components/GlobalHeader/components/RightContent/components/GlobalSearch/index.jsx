/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Dropdown, Input, Row, Col, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import styles from './index.less';
import CardItem from './components/CardItem/index';
import Documents from './components/Documents';
import Ticket from './components/Ticket';
import EmptyComponent from '@/components/Empty';

const GlobalSearch = (props) => {
  const { dispatch, employees, employeeDoc, tickets, keySearch, loadingFetch = false } = props;
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (text.length >= 3) {
      dispatch({
        type: 'searchAdvance/searchGlobal',
        payload: {
          keySearch: text,
        },
      });
    }
  }, [text]);

  const changeInput = (e) => {
    setText(e.target.value);
    if (e.target.value.length >= 3) setVisible(true);
    else setVisible(false);
  };

  const onClose = () => {
    setVisible(false);
  };
  const handleChangeVisible = (flag) => {
    if (!flag || text.length >= 3) {
      setVisible(flag);
    }
  };
  const onShowMore = (key) => {
    dispatch({
      type: 'searchAdvance/save',
      payload: { keySearch: text, isSearch: true },
    });
    onClose();
    history.push(`/search-result/${key}`);
  };

  const onAdvancedSearch = () => {
    onClose();
    history.push('/search-result/employees/advanced-search');
  };
  const menu = (
    <div className={styles.resultSearch}>
      <Spin spinning={loadingFetch}>
        {employees.length === 0 && employeeDoc.length === 0 && tickets.length === 0 && (
          <EmptyComponent />
        )}
        {employees.length > 0 && (
          <div className={styles.blog}>
            <div className={styles.blog__title}>
              <div className={styles.type}>Employee</div>
              <div className={styles.showMore} onClick={() => onShowMore('employees')}>
                Show more
              </div>
            </div>
            <div className={styles.blog__content}>
              <Row gutter={[24, 24]}>
                {employees.map((item, index) => {
                  const {
                    titleInfo: { name: title = '' } = {},
                    generalInfo: {
                      avatar = '',
                      userId,
                      workNumber,
                      firstName = '',
                      middleName = '',
                      lastName = '',
                      legalName,
                    },
                  } = item;
                  if (index < 3)
                    return (
                      <Col span={8}>
                        <CardItem
                          avatar={avatar}
                          userId={userId}
                          fullName={legalName || `${firstName}${` ${middleName}`}${` ${lastName}`}`}
                          workNumber={workNumber}
                          title={title}
                          onClick={onClose}
                        />
                      </Col>
                    );
                })}
              </Row>
            </div>
          </div>
        )}
        {employeeDoc.length > 0 && (
          <div className={styles.blog}>
            <div className={styles.blog__title}>
              <div className={styles.type}>Documents</div>
              <div className={styles.showMore} onClick={() => onShowMore('documents')}>
                Show more
              </div>
            </div>
            <div className={styles.blog__content}>
              <Documents listDocument={employeeDoc} onClick={onClose} />
            </div>
          </div>
        )}
        {tickets.length > 0 && (
          <div className={styles.blog}>
            <div className={styles.blog__title}>
              <div className={styles.type}>Tickets</div>
              <div className={styles.showMore} onClick={() => onShowMore('tickets')}>
                Show more
              </div>
            </div>
            <div className={styles.blog__content}>
              <Row gutter={[24, 24]}>
                {tickets.map((item, index) => {
                  const { ticketID, title, id, employee } = item;
                  if (index < 3)
                    return (
                      <Col span={8}>
                        <Ticket
                          ticketId={ticketID}
                          title={title}
                          id={id}
                          employee={employee}
                          onClick={onClose}
                        />
                      </Col>
                    );
                })}
              </Row>
            </div>
          </div>
        )}
      </Spin>

      <div
        className={styles.advancedSearch}
        style={{
          borderTop:
            employees.length === 0 && employeeDoc.length === 0 && tickets.length === 0
              ? '1px solid #EAECEF'
              : null,
        }}
      >
        <div className={styles.advancedSearch__text} onClick={onAdvancedSearch}>
          Advanced Search
        </div>
      </div>
    </div>
  );
  return (
    <div
      className={styles.globalSearch}
      style={{
        width: isSearching ? "30vw" : 44,
        cursor: !isSearching ? 'pointer' : 'default',
      }}
      onClick={() => setIsSearching(true)}
    >
      <Dropdown
        overlay={menu}
        trigger={['click']}
        visible={visible}
        onVisibleChange={handleChangeVisible}
        // destroyPopupOnHide
        overlayClassName={styles.searchDropdown}
        placement="bottomRight"
      >
        <Input
          placeholder="Search"
          defaultValue={keySearch}
          value={text}
          prefix={<SearchOutlined />}
          onChange={changeInput}
        />
      </Dropdown>
    </div>
  );
};
export default connect(
  ({
    searchAdvance: {
      keySearch,
      globalSearch: { employees, employeeDoc, tickets },
    },
    loading,
  }) => ({
    keySearch,
    employees,
    employeeDoc,
    tickets,
    loadingFetch: loading.effects['searchAdvance/searchGlobal'],
  }),
)(GlobalSearch);
