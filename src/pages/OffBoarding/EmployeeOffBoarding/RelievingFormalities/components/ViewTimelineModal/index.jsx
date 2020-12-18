import React, { PureComponent } from 'react';
import { Calendar, Select, Radio, Col, Row, Typography, Modal, Button } from 'antd';

import { connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    offboarding: { relievingDetails: { isSent, exitPackage: { waitList = [] } = {} } = {} } = {},
  }) => ({
    waitList,
    isSent,
  }),
)
class ViewTimelineModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  onPanelChange = (value, mode) => {
    console.log(value, mode);
  };

  render() {
    const { visible, onClose = () => {}, submitText = '' } = this.props;

    return (
      <Modal
        className={styles.ViewTimelineModal}
        onCancel={() => onClose()}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <p className={styles.title}>View timeline</p>
          <div className={styles.calendar}>
            <Calendar
              headerRender={({ value, type, onChange, onTypeChange }) => {
                const start = 0;
                const end = 12;
                const monthOptions = [];

                const current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  current.month(i);
                  months.push(localeData.monthsShort(current));
                }

                for (let index = start; index < end; index++) {
                  monthOptions.push(
                    <Select.Option className="month-item" key={`${index}`}>
                      {months[index]}
                    </Select.Option>,
                  );
                }
                const month = value.month();

                const year = value.year();
                const options = [];
                for (let i = year - 10; i < year + 10; i += 1) {
                  options.push(
                    <Select.Option key={i} value={i} className="year-item">
                      {i}
                    </Select.Option>,
                  );
                }
                return (
                  <div style={{ padding: 8 }}>
                    <Typography.Title level={4}>Custom header</Typography.Title>
                    <Row gutter={8}>
                      <Col>
                        <Radio.Group
                          size="small"
                          onChange={(e) => onTypeChange(e.target.value)}
                          value={type}
                        >
                          <Radio.Button value="month">Month</Radio.Button>
                          <Radio.Button value="year">Year</Radio.Button>
                        </Radio.Group>
                      </Col>
                      <Col>
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          className="my-year-select"
                          onChange={(newYear) => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                          }}
                          value={String(year)}
                        >
                          {options}
                        </Select>
                      </Col>
                      <Col>
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          value={String(month)}
                          onChange={(selectedMonth) => {
                            const newValue = value.clone();
                            newValue.month(parseInt(selectedMonth, 10));
                            onChange(newValue);
                          }}
                        >
                          {monthOptions}
                        </Select>
                      </Col>
                    </Row>
                  </div>
                );
              }}
              fullscreen
              onPanelChange={this.onPanelChange}
            />
          </div>
          <div className={styles.footer}>
            <Button onClick={onClose}>{submitText}</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ViewTimelineModal;
