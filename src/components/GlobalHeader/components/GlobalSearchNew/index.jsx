import React, { useState, useEffect } from 'react';
import { Dropdown, Input, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import styles from './index.less';
import CardItem from './components/CardItem/index';
import Documents from './components/Documents';
import Ticket from './components/Ticket';

const GlobalSearchNew = (props) => {
  const { dispatch, employees, employeeDoc, tickets } = props;
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (text.length >= 3) {
      dispatch({
        type: 'searchAdvance/search',
        payload: {
          keySearch: text,
          page: 1,
          limit: 10,
        },
      });
    }
  }, [text]);

  const changeInput = (e) => {
    setText(e.target.value);
    if (e.target.value.length >= 3) setVisible(true);
    else setVisible(false);
  };
  const onFocusSearch = () => {
    if (text.length >= 3) setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const menu = (
    <div className={styles.resultSearch}>
      {employees.length > 0 && (
        <div className={styles.blog}>
          <div className={styles.blog__title}>
            <div className={styles.type}>Employee</div>
            <div
              className={styles.showMore}
              onClick={() => {
                onClose();
                history.push('/search-result/employees');
              }}
            >
              Show more
            </div>
          </div>
          <div className={styles.blog__content}>
            <Row gutter={[24, 24]}>
              {employees.map((item, index) => {
                const {
                  titleInfo: { name: title },
                  generalInfo: {
                    avatar,
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
            <div
              className={styles.showMore}
              onClick={() => {
                onClose();
                history.push('/search-result/documents');
              }}
            >
              Show more
            </div>
          </div>
          <div className={styles.blog__content}>
            <Documents listDocument={employeeDoc} />
          </div>
        </div>
      )}
      {tickets.length > 0 && (
        <div className={styles.blog}>
          <div className={styles.blog__title}>
            <div className={styles.type}>Tickets</div>
            <div
              className={styles.showMore}
              onClick={() => {
                onClose();
                history.push('/search-result/tickets');
              }}
            >
              Show more
            </div>
          </div>
          <div className={styles.blog__content}>
            <Row gutter={[24, 24]}>
              {tickets.map((item, index) => {
                const { ticketID, title, id } = item;
                if (index < 3)
                  return (
                    <Col span={8}>
                      <Ticket ticketId={ticketID} title={title} id={id} onClick={onClose} />
                    </Col>
                  );
              })}
            </Row>
          </div>
        </div>
      )}
      <div className={styles.advancedSearch}>
        <div className={styles.advancedSearch__text} onClick={onClose}>
          Advanced Search
        </div>
      </div>
    </div>
  );
  return (
    <div className={styles.globalSearch}>
      <Dropdown
        overlay={menu}
        trigger={['click']}
        visible={visible}
        destroyPopupOnHide
        overlayClassName={styles.searchDropdown}
      >
        <Input
          placeholder="Search"
          value={text}
          prefix={<SearchOutlined />}
          onChange={changeInput}
          onFocus={onFocusSearch}
          // onBlur={() => setVisible(false)}
        />
      </Dropdown>
    </div>
  );
};
export default connect(
  ({
    searchAdvance: {
      keySearch,
      result: { employees, employeeDoc, tickets },
    },
  }) => ({ keySearch, employees, employeeDoc, tickets }),
)(GlobalSearchNew);
// export default GlobalSearchNew;
