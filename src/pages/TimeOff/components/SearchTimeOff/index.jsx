import React, { useState, useEffect } from 'react';
import { Space, Button, Row, Checkbox, Col, DatePicker } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { debounce } from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import CustomSearchBox from '@/components/CustomSearchBox';
import filterIcon from '@/assets/offboarding-filter.svg';
import styles from './index.less';

const SearchTimeOff = (props) => {
  const {
    dispatch,
    timeOffTypesByCountry,
    filter: { search, type, fromDate, toDate },
  } = props;
  const [searchText, setSearchText] = useState(search);
  const [listType, setListType] = useState(type);
  const [dateStart, setDateStart] = useState(fromDate);
  const [dateEnd, setDateEnd] = useState(toDate);
  const [openModal, setOpenModal] = useState(false);
  const dateFormat = 'MM.DD.YYYY';

  useEffect(() => {
    setSearchText(search);
    setListType(type);
    setDateStart(fromDate);
    setDateEnd(toDate);
  }, [search, type, fromDate, toDate]);

  const saveSearch = () => {
    dispatch({
      type: 'timeOff/saveFilter',
      payload: {
        isSearch: true,
        search: searchText,
      },
    });
    dispatch({
      type: 'timeOff/savePaging',
      payload: {
        page: 1,
      },
    });
  };

  const onSearchDebounce = debounce((value) => {
    setSearchText(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const onSave = () => {
    dispatch({
      type: 'timeOff/saveFilter',
      payload: {
        type: listType,
        fromDate: dateStart,
        toDate: dateEnd,
      },
    });
    setOpenModal(false);
  };

  useEffect(() => {
    saveSearch();
  }, [searchText]);

  const fromDateOnChange = (_, e) => {
    setDateStart(e);
  };

  const toDateOnChange = (_, e) => {
    setDateEnd(e);
  };

  const onChangeCheckBox = (e) => {
    setListType(e);
  };
  return (
    <>
      <Space direction="horizontal">
        <Button type="link" onClick={() => setOpenModal(true)}>
          <img src={filterIcon} alt="" />
        </Button>
        <CustomSearchBox onSearch={onSearch} placeholder="Search by Employee ID, name..." />
      </Space>
      <Modal
        className={styles.modalCustom}
        visible={openModal}
        onOk={onSave}
        onCancel={() => setOpenModal(false)}
        destroyOnClose
        footer={[
          <div key="cancel" className={styles.btnCancel} onClick={() => setOpenModal(false)}>
            Cancel
          </div>,
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            onClick={onSave}
            // loading={loading}
            className={styles.btnSubmit}
          >
            Save
          </Button>,
        ]}
      >
        <Row className={styles.bodyModal}>
          <Col span={24}>
            <Row className={styles.title}>Time Off Types</Row>
            <Checkbox.Group
              className={styles.checkbox}
              onChange={onChangeCheckBox}
              value={listType}
            >
              {timeOffTypesByCountry?.map((timeOfType) => (
                <Row className={styles.rowCheckbox}>
                  <Checkbox value={timeOfType._id}>{timeOfType.name}</Checkbox>
                </Row>
              ))}
            </Checkbox.Group>

            <Row className={styles.title}>Duration</Row>
            <Row className={styles.title}>
              <Col span={12}>
                <DatePicker
                  className={styles.datePicker}
                  // disabledDate={this.disabledToDate}
                  format={dateFormat}
                  onChange={fromDateOnChange}
                  placeholder="From Date"
                  value={dateStart && moment(dateStart, dateFormat)}
                />
              </Col>
              <Col span={12}>
                <DatePicker
                  className={styles.datePicker}
                  // disabledDate={this.disabledToDate}
                  format={dateFormat}
                  onChange={toDateOnChange}
                  placeholder="To Date"
                  value={dateEnd && moment(dateEnd, dateFormat)}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default connect(({ dispatch, timeOff: { timeOffTypesByCountry = [], filter = {} } }) => ({
  dispatch,
  timeOffTypesByCountry,
  filter,
}))(SearchTimeOff);
