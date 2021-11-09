import { Col, DatePicker, Button, Form, Popover, Row, Select } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CloseIcon from '@/assets/projectManagement/closeX.svg';
import styles from './index.less';

const FilterPopover = (props) => {
  const { children, placement = 'bottom', onSubmit = () => {}, listEmployeeActive = [] } = props;
  const [showPopover, setShowPopover] = useState(false);

  const onFormSubmit = (values) => {
    //
  };

  const renderPopup = () => {
    return (
      <>
        <div className={styles.popupContainer}>
          <Form layout="vertical" name="filter" onFinish={(values) => onSubmit(values)}>
            <Form.Item label="By Project ID" name="byProjectID">
              <Select allowClear style={{ width: '100%' }} placeholder="Please select">
                {['A', 'B'].map((item) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="By division" name="byDivision">
              <Select
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
              >
                {['A', 'B'].map((item) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By PROJECT NAME" name="byProjectName">
              <Select
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
              >
                {['A', 'B'].map((item) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By customer" name="byCustomer">
              <Select
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
              >
                {['A', 'B'].map((item) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By engagement type" name="byEngagementType">
              <Select
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
              >
                {['A', 'B'].map((item) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By PROJECT manager" name="byProjectManager">
              <Select
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
              >
                {['A', 'B'].map((item) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By status" name="byStatus">
              <Select
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
              >
                {['A', 'B'].map((item) => {
                  return (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By Start Date">
              <Row>
                <Col span={11}>
                  <Form.Item name="s_fromDate">
                    <DatePicker format="MMM DD, YYYY" />
                  </Form.Item>
                </Col>
                <Col span={2} className={styles.separator}>
                  <span>to</span>
                </Col>
                <Col span={11}>
                  <Form.Item name="s_toDate">
                    <DatePicker format="MMM DD, YYYY" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="By Tentative end date">
              <Row>
                <Col span={11}>
                  <Form.Item name="e_fromDate">
                    <DatePicker format="MMM DD, YYYY" />
                  </Form.Item>
                </Col>
                <Col span={2} className={styles.separator}>
                  <span>to</span>
                </Col>
                <Col span={11}>
                  <Form.Item name="e_toDate">
                    <DatePicker format="MMM DD, YYYY" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.buttons}>
          <Button className={styles.btnClose} onClick={() => setShowPopover(false)}>
            Close
          </Button>
          <Button
            className={styles.btnApply}
            form="filter"
            htmlType="submit"
            key="submit"
            onClick={onFormSubmit}
          >
            Apply
          </Button>
        </div>
      </>
    );
  };

  return (
    <Popover
      placement={placement}
      title={() => (
        <div className={styles.popoverHeader}>
          <span className={styles.headTitle}>Filters</span>
          <span
            className={styles.closeIcon}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowPopover(false)}
          >
            <img src={CloseIcon} alt="close" />
          </span>
        </div>
      )}
      content={() => renderPopup()}
      trigger="click"
      visible={showPopover}
      overlayClassName={styles.FilterPopover}
      onVisibleChange={() => {
        setShowPopover(!showPopover);
      }}
    >
      {children}
    </Popover>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  FilterPopover,
);
