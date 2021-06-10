import React, { Component } from 'react';
import { connect } from 'umi';
import { Row, Col, Button, Select, Spin } from 'antd';
// import addIcon from '@/assets/addTicket.svg';
// import icon from '@/assets/delete.svg';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';
import { getCurrentTenant } from '@/utils/authority';

const { Option } = Select;
@connect(({ timeOff: { countryList = [] } = {}, loading }) => ({
  countryList,
  loadingListCountry: loading.effects['timeOff/getCountryList'],
}))
class RuleFrom extends Component {
  onChange = () => {};

  renderItem = (render) => {
    const { children = [] } = render;

    return (
      <div className={styles.timeOffRuleFrom}>
        <div className={styles.from}>
          <Row gutter={[24, 12]} className={styles.from__rowItem}>
            <Col span={8}>
              <div className={styles.title}>{render.type}</div>
            </Col>
            <Col span={8} />
            <Col span={8} className={styles.colAction}>
              <Button className={styles.buttonRequest}>{render.button}</Button>
            </Col>
          </Row>
          <div className={styles.straightLine} />
          <div>
            {children.map((item, index) => {
              const { title, name, change, isDefault } = item;
              // const classNameStatus = status === 100 ? styles.complete : styles.uncomplete;
              return (
                <div key={`${index + 1}`}>
                  <Row gutter={[24, 12]} className={styles.from__rowItem}>
                    <Col span={16}>
                      <div className={styles.text}>
                        {name}
                        {isDefault ? '*' : ''}
                      </div>
                    </Col>
                    {/* <Col span={8}>
                      <div className={classNameStatus}>
                        <span>{status > 0 ? `Completion rate: ${status}%` : null}</span>
                      </div>
                    </Col> */}
                    <Col span={8} className={styles.colAction}>
                      {/* {name !== 'true' ? ( */}
                      <div className={styles.setup}>
                        <span onClick={() => this.onChange(item._id, true)}>
                          {isDefault ? 'Configure' : 'Setup'}
                        </span>
                        {isDefault ? (
                          ''
                        ) : (
                          <div className={styles.deleteIcon}>
                            <DeleteOutlined className={styles.iconImg} />
                          </div>
                        )}
                      </div>
                      {/* ) : (
                        <div className={styles.setup}>
                          <span>{isDefault ? 'Configure' : 'Setup'}</span>
                          <div className={styles.deleteIcon}>
                            <DeleteOutlined className={styles.iconImg} />
                          </div>
                          <span />
                        </div>
                      )} */}
                    </Col>
                  </Row>
                  {index !== children.length - 1 && <div className={styles.borderStyles} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  handleChangeSelect = (value) => {
    console.log('value: ', value);
  };

  renderCountry = () => {
    const { countryList = [] } = this.props;
    const arrCountry = [
      {
        id: 'IN',
        value: 'India',
      },
      {
        id: 'US',
        value: 'USA',
      },
      {
        id: 'VN',
        value: 'Viet Nam',
      },
    ];

    let flagUrl = '';

    const flagItem = (id) => {
      countryList.forEach((item) => {
        if (item._id === id) {
          flagUrl = item.flag;
        }
        return flagUrl;
      });

      return (
        <div
          style={{
            maxWidth: '16px',
            height: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '12px',
          }}
        >
          <img
            src={flagUrl}
            alt="flag"
            style={{
              width: '100%',
              borderRadius: '50%',
              height: '100%',
            }}
          />
        </div>
      );
    };
    return (
      <>
        {arrCountry.map((item) => (
          <Option key={item.id} value={item.value} style={{ height: '20px', display: 'flex' }}>
            <div className={styles.labelText}>
              {flagItem(item.id)}
              <span>{item.value}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  onChange = (value, isEdit) => {
    const { onChangeType, dispatch } = this.props;
    dispatch({
      type: 'timeOff/getCountryList',
      payload: {
        _id: value,
        tenantId: getCurrentTenant(),
      },
    });
    onChangeType(value, isEdit);
  };

  render() {
    const { onGetDataById = () => {}, timeOffTypes = [] } = this.props;

    const array = [
      {
        typeName: 'A',
        type: 'Type A: Paid Leaves',
        button: 'Add a new paid leave',

        children: [],
      },
      {
        typeName: 'B',
        type: 'Type B: Unpaid Leaves',
        button: 'Add a new unpaid leave',
        children: [],
      },
      {
        typeName: 'C',
        type: 'Type C: Special Leaves',
        button: 'Add a new special leave',
        children: [],
      },
      {
        typeName: 'D',
        type: 'Type D: Working our of office',
        button: 'Add a new OoO timeoff',
        children: [],
      },
    ];

    timeOffTypes.map((item) => {
      array.map((ele) => {
        if (ele.typeName === item.type) {
          item.change = this.onChange;
          ele.children.push(item);
        }
      });
      if (item.name === 'Casual Leave') {
        const i = timeOffTypes.indexOf(item);
        timeOffTypes.splice(0, 0, timeOffTypes.splice(i, 1)[0]);
      }
    });
    console.log('array', array);

    const { loadingListCountry } = this.props;
    return (
      <>
        {loadingListCountry ? (
          <div className={styles.loadingListCountry}>
            <Spin size="large" />
          </div>
        ) : (
          <div className={styles.root}>
            <div className={styles.topHeader}>
              <Select
                size="large"
                placeholder="Please select country"
                showArrow
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                className={styles.selectCountry}
                defaultValue="India"
                onChange={(value) => this.handleChangeSelect(value)}
              >
                {this.renderCountry()}
              </Select>
            </div>
            <Row gutter={[24, 12]}>
              {array.map((render, index) => (
                <Col key={`${index + 1}`} span={24}>
                  {this.renderItem(render)}
                </Col>
              ))}
            </Row>
            <div className={styles.footer}>
              <Button className={styles.btnNext}>Next</Button>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default RuleFrom;
