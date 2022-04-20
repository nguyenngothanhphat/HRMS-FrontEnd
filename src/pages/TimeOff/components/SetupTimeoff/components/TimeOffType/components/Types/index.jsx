import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Popconfirm, Row, Select, Spin } from 'antd';
import React, { Component } from 'react';
import { history } from 'umi';
import EmptyComponent from '@/components/Empty';
import styles from './index.less';

const { Option } = Select;

class Types extends Component {
  renderItem = (item) => {
    const { removeItem = () => {} } = this.props;
    const { children = [] } = item;

    return (
      <div className={styles.item}>
        <div className={styles.from}>
          <Row className={styles.from__rowItem} align="middle">
            <Col span={8}>
              <div className={styles.title}>
                Type {item.type}: {item.typeName}
              </div>
            </Col>
            <Col span={8} />
            <Col span={8} className={styles.colAction}>
              <Button className={styles.buttonRequest} onClick={() => this.addNewType(item)}>
                {item.button}
              </Button>
            </Col>
          </Row>
          {children.length !== 0 && <div className={styles.straightLine} />}

          <div>
            {children.map((x, index) => {
              const { name, isDefault } = x;
              return (
                <div key={`${index + 1}`}>
                  <Row className={styles.from__rowItem} align="middle">
                    <Col span={16}>
                      <div className={styles.text}>
                        {name}
                        {isDefault ? '*' : ''}
                      </div>
                    </Col>
                    <Col span={8} className={styles.colAction}>
                      <div className={styles.setup}>
                        <span onClick={() => this.onChange(x)}>
                          {isDefault ? 'Configure' : 'Setup'}
                        </span>
                        {!isDefault && (
                          <Popconfirm
                            onConfirm={() => removeItem(x._id)}
                            title="Are you sure to remove?"
                            placement="right"
                          >
                            <div className={styles.deleteIcon}>
                              <DeleteOutlined className={styles.iconImg} />
                            </div>
                          </Popconfirm>
                        )}
                      </div>
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

  addNewType = (payload) => {
    const { selectedCountry = '' } = this.props;
    history.push({
      pathname: `/time-off/setup/types-rules/add`,
      state: {
        type: payload.type,
        typeName: payload.typeName,
        country: selectedCountry,
        isValid: true,
      },
    });
  };

  handleChangeSelect = (value) => {
    const { handleChangeCountry } = this.props;
    handleChangeCountry(value);
  };

  renderCountry = () => {
    const { countryList = [] } = this.props;

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
        {countryList.map((item) => (
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

  onChange = (payload) => {
    const { onChangeType } = this.props;
    onChangeType(payload);
  };

  removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  render() {
    const {
      timeOffTypes = [],
      loadingFetchList,
      selectedCountry,
      loadingFetchCountryList = false,
    } = this.props;

    const array = [
      {
        type: 'A',
        typeName: 'Paid Leaves',
        button: 'Add a new paid leave',
        children: [],
      },
      {
        type: 'B',
        typeName: 'Unpaid Leaves',
        button: 'Add a new unpaid leave',
        children: [],
      },
      {
        type: 'C',
        typeName: 'Special Leaves',
        button: 'Add a new special leave',
        children: [],
      },
      {
        type: 'D',
        typeName: 'Working out of office',
        button: 'Add a new WOO leave',
        children: [],
      },
    ];

    // remove Duplicate
    const newArr = this.removeDuplicate(timeOffTypes, (item) => item.name);

    // add item to array
    newArr.map((item) => {
      array.map((ele) => {
        if (ele.type === item.type) {
          // eslint-disable-next-line no-param-reassign
          item.change = this.onChange;
          ele.children.push(item);
        }
        return ele;
      });

      return item;
    });

    return (
      <>
        <div className={styles.Types}>
          <div className={styles.topHeader}>
            <Select
              showArrow
              filterOption={(input, option) => {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              value={selectedCountry}
              className={styles.selectCountry}
              onChange={(value) => this.handleChangeSelect(value)}
              loading={loadingFetchCountryList}
              placeholder={loadingFetchCountryList ? 'Loading country list...' : 'Select country'}
            >
              {this.renderCountry()}
            </Select>
          </div>

          <Spin spinning={loadingFetchList}>
            <Row gutter={[0, 24]}>
              {array.map((render, index) => (
                <Col key={`${index + 1}`} span={24}>
                  {this.renderItem(render)}
                </Col>
              ))}
            </Row>
          </Spin>
        </div>
      </>
    );
  }
}

export default Types;
