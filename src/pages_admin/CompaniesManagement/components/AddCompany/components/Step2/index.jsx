/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-curly-newline */
import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Select } from 'antd';
import { formatMessage } from 'umi';
import styles from './index.less';

class Step2 extends PureComponent {
  navigate = () => {};

  render() {
    return (
      <div className={styles.root}>
        <Row justify="center">
          <Row gutter={[30, 0]}>
            <Col>
              <div className={styles.root__form}>
                <Form
                  name="addLocation"
                  requiredMark={false}
                  layout="vertical"
                  colon={false}
                  initialValues={
                    {
                      // remember: true,
                      // address: headQuarterAddress.address,
                      // country: headQuarterAddress.country,
                      // state: headQuarterAddress.state,
                      // zipCode: headQuarterAddress.zipCode,
                      // locations: [
                      //   {
                      //     address: 'a1',
                      //     country: '',
                      //     state: '',
                      //     zipCode: 'z1',
                      //   },
                      // ],
                    }
                  }
                  onValuesChange={this.handleFormCompanyChange}
                >
                  <Fragment>
                    <p className={styles.root__form__title}>Work Locations</p>
                    <p className={styles.root__form__description}>
                      We Need To Collect This Information To Assign Your Employees To The Right
                      Office. We Will Allow You To Office Specific Administrators, Filter Employees
                      Per Work Location.
                    </p>
                    <p className={styles.root__form__title}>Headquarter address</p>
                    <Form.Item label="Address*" name="address">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Country" name="country">
                      <Select
                        placeholder="Select Country"
                        showArrow
                        showSearch
                        onChange={this.onChangeCountryHeadquarter}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {/* {listCountry.map((item) => (
                    <Option key={item._id}>{item.name}</Option>
                  ))} */}
                      </Select>
                    </Form.Item>
                    <Row gutter={[30, 0]}>
                      <Col span={12}>
                        <Form.Item label="State" name="state">
                          <Select>
                            {/* {listStateHead.map((item) => (
                        <Option key={item}>{item}</Option>
                      ))} */}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Zip Code" name="zipCode">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Fragment>
                </Form>
              </div>
              <Button className={styles.btn_addLocation} type="link" onClick={this.addLocation}>
                + Add work location
              </Button>

              <div className={styles.btnWrapper}>
                <Button className={styles.btn} onClick={this.navigate('previous')}>
                  {formatMessage({ id: 'page.signUp.step2.back' })}
                </Button>
                <Button className={styles.btn} htmlType="submit" onClick={this.navigate('next')}>
                  {formatMessage({ id: 'page.signUp.step2.next' })}
                </Button>
              </div>
            </Col>
            <Col>
              <div className={styles.root__form__image}>
                <img src="/assets/images/Intranet_01@3x.png" alt="image_intranet" />
              </div>
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}

export default Step2;
