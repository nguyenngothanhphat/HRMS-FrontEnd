import React, { Component } from 'react';
import { Form, Col, Row, Checkbox, InputNumber, Radio } from 'antd';
import styles from './index.less';

class FormConfigure extends Component {
  render() {
    return (
      <>
        <Form>
          <div className={styles.contentBaseAccrual}>
            <div className={styles.title}>Base accrual rate</div>
            <div className={styles.borderStyles} />
            <div className={styles.formBody}>
              <Row gutter={[24, 12]}>
                <Col span={10}>
                  <div className={styles.leftSection}>
                    <div className={styles.titleText}>
                      During the employee’s 1st year of employment, total casual leave accrued
                    </div>
                    <Form.Item>
                      <Checkbox
                        // checked={unlimited}
                        className={styles.checkbox}
                        onChange={(e) => this.onChangeSelect(e)}
                      >
                        Unlimited causal leave
                      </Checkbox>
                    </Form.Item>
                  </div>
                </Col>
                <Col span={14} className={styles.rightSection}>
                  <Row className={styles.inputText} gutter={[24, 0]}>
                    <Col>
                      <Form.Item name="total">
                        <InputNumber
                          min={0}
                          //   max={date === 'day' ? 365 : 12}
                          // defaultValue={0}
                          //   defaultValue={time}
                          // placeholder={date === 'day' ? 'days' : 'hours'}
                          // formatter={(value) => (date === 'day' ? `${value} days` : `${value} hours`)}
                          // parser={(value) =>
                          //   date === 'day' ? value.replace('days', '') : value.replace('hours', '')
                          // }
                          onChange={this.onChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ paddingLeft: '1px !important' }}>
                      {/* <div className={styles.radioTime}> */}
                      <Radio.Group
                        onChange={this.onChangeRadio}
                        // options={option}
                        // value={date}
                        optionType="button"
                        buttonStyle="solid"
                        className={styles.radioGroup}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

export default FormConfigure;
