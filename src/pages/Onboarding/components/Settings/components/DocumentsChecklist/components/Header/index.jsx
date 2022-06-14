import { Button, Col, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';
import UploadDocument from '../UploadDocument';
import styles from './index.less';

const { Option } = Select;
const Header = (props) => {
  const { dispatch, handleUploadDocument = () => {} } = props;
  const {
    user: {
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = {},
      } = {},
    } = {},
    location: { companyLocationList: locationList = [] } = {},
  } = props;

  const removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  const renderCountry = () => {
    let countryArr = [];
    if (locationList.length > 0) {
      countryArr = locationList.map((item) => {
        return item.headQuarterAddress?.country;
      });
    }
    const newArr = removeDuplicate(countryArr, (item) => item?._id);

    let flagUrl = '';

    const flagItem = (id) => {
      newArr.forEach((item) => {
        if (item?._id === id) {
          flagUrl = item?.flag;
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
          <Option key={item?._id} value={item?._id} className={styles.optionCountry}>
            <div className={styles.labelText}>
              {flagItem(item?._id)}
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{item?.name}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  const changeCountry = async (value) => {};

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
              defaultValue={countryID}
              size="large"
              placeholder="Please select country"
              showArrow
              filterOption={(input, option) => {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              className={styles.selectCountry}
              onChange={(value) => changeCountry(value)}
            >
              {renderCountry()}
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
