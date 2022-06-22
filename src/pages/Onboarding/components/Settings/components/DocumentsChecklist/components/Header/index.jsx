import { Button, Col, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { getCurrentLocation } from '@/utils/authority';
import UploadDocument from '../UploadDocument';
import styles from './index.less';

const { Option } = Select;
const Header = (props) => {
  const {
    dispatch,
    handleUploadDocument = () => {},
    handleCancelUploadDocument = () => {},
  } = props;
  const { location: { companyLocationList: locationList = [] } = {} } = props;
  const currentLocation = getCurrentLocation();
  console.log('🚀 ~ locationList', locationList);
  const removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  const changeLocation = async (value) => {};

  return (
    <Row className={styles.Header} gutter={[24, 24]}>
      <Col className={styles.leftPart}>
        <div className={styles.title}>Document Checklist</div>
        <div className={styles.subTitle}>
          You are required to upload all the documents that would be sent to the candidate
        </div>
      </Col>
      <Col className={styles.location}>
        <Row gutter={[24, 0]}>
          <Col>
            <Select
              defaultValue={currentLocation}
              size="large"
              placeholder="Please select country"
              showArrow
              filterOption={(input, option) => {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              className={styles.selectCountry}
              onChange={(value) => changeLocation(value)}
            >
              {locationList.map((item) => {
                return (
                  <Select.Option value={item._id} key={item.name}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
          <Col className={styles.rightPart}>
            <div onClick={() => handleUploadDocument()}>
              <Button className={styles.addButton}> Upload Document</Button>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default connect(({ user, location }) => ({ user, location }))(Header);
