/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
// import { connect } from 'umi';
import { Row, Col, Button, Select, Spin } from 'antd';
// import addIcon from '@/assets/addTicket.svg';
// import icon from '@/assets/delete.svg';
import { DeleteOutlined } from '@ant-design/icons';
// import { getCurrentTenant } from '@/utils/authority';
// import _ from 'lodash';
import styles from './index.less';
import ModalAddType from './ModalAddType';

const { Option } = Select;
class RuleFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  renderItem = (render) => {
    const { removeItem = () => {} } = this.props;
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
              <Button className={styles.buttonRequest} onClick={() => this.showModal(render)}>
                {render.button}
              </Button>
            </Col>
          </Row>
          <div className={styles.straightLine} />
          <div>
            {children.map((item, index) => {
              const { name, isDefault } = item;
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
                          <div className={styles.deleteIcon} onClick={() => removeItem(item._id)}>
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

  showModal = (type) => {
    const { isVisible } = this.state;
    const { onTypeSelected } = this.props;
    this.setState({
      isVisible: !isVisible,
    });
    onTypeSelected(type);
  };

  closeModal = () => {
    const { isVisible } = this.state;
    this.setState({
      isVisible: !isVisible,
    });
  };

  handleCancel = () => {
    const { isVisible } = this.state;
    this.setState({
      isVisible: !isVisible,
    });
  };

  handleChangeSelect = (value) => {
    const { handleChangeCountry } = this.props;
    handleChangeCountry(value);
  };

  renderCountry = () => {
    const { countryList = [] } = this.props;
    let countryArr = [];
    countryArr = countryList.map((item) => {
      return item.headQuarterAddress.country;
    });
    const newArr = this.removeDuplicate(countryArr, (item) => item._id);

    let flagUrl = '';

    const flagItem = (id) => {
      newArr.forEach((item) => {
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
        {newArr.map((item) => (
          <Option key={item._id} value={item._id} style={{ height: '20px', display: 'flex' }}>
            <div className={styles.labelText}>
              {flagItem(item._id)}
              <span>{item.name}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  onChange = (value, isEdit) => {
    const { onChangeType } = this.props;
    onChangeType(value, isEdit);
  };

  removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  render() {
    const {
      timeOffTypes = [],
      countryList = [],
      addNewType = () => {},
      loadingAddType,
      loadingFetchList,
      // countrySelected,
    } = this.props;
    const { isVisible } = this.state;
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
        button: 'Add a new WOO leave',
        children: [],
      },
    ];

    // remove Duplicate
    const newArr = this.removeDuplicate(timeOffTypes, (item) => item.name);

    // add item to array
    newArr.map((item) => {
      array.map((ele) => {
        if (ele.typeName === item.type) {
          item.change = this.onChange;
          ele.children.push(item);
        }
        return ele;
      });

      return item;
    });

    return (
      <>
        <div className={styles.root}>
          <div className={styles.topHeader}>
            {countryList.length === 0 ? (
              <div className={styles.loadingListCountry}>
                <Spin size="large" />
              </div>
            ) : (
              <Select
                size="large"
                placeholder="Please select country"
                showArrow
                filterOption={(input, option) => {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                // defaultValue={countrySelected}
                className={styles.selectCountry}
                onChange={(value) => this.handleChangeSelect(value)}
              >
                {this.renderCountry()}
              </Select>
            )}
          </div>
          {loadingFetchList ? (
            <div className={styles.loadingListCountry}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 12]}>
              {array.map((render, index) => (
                <Col key={`${index + 1}`} span={24}>
                  {this.renderItem(render)}
                </Col>
              ))}
            </Row>
          )}

          <div className={styles.footer}>
            <Button className={styles.btnNext}>Next</Button>
          </div>
          <ModalAddType
            closeModal={this.closeModal}
            isVisible={isVisible}
            onCancel={this.handleCandel}
            onFinish={addNewType}
            loadingAddType={loadingAddType}
          />
        </div>
      </>
    );
  }
}

export default RuleFrom;
