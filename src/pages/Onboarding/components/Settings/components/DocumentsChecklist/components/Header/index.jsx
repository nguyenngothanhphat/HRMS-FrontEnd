import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentLocation } from '@/utils/authority';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import styles from './index.less';

const Header = (props) => {
  const {
    dispatch,
    handleUploadDocument = () => {},
    onboardingSettings: { selectedLocations: selectedLocationsProp = [] } = {},
    location: { companyLocationList = [] } = {},
  } = props;

  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    setSelectedLocations(selectedLocationsProp);
  }, [JSON.stringify(selectedLocationsProp)]);

  useEffect(() => {
    const currentLocation = getCurrentLocation();
    if (currentLocation) {
      dispatch({
        type: 'onboardingSettings/save',
        payload: {
          selectedLocations: [currentLocation],
        },
      });
    }
  }, []);

  const onLocationChange = (value) => {
    dispatch({
      type: 'onboardingSettings/save',
      payload: {
        selectedLocations: [...value],
      },
    });
    setSelectedLocations([...value]);
  };

  const renderLocationOptions = () => {
    const locationOptions = companyLocationList.map((x) => {
      return {
        _id: x._id,
        name: x.name,
      };
    });
    return locationOptions;
  };

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
            <CustomDropdownSelector
              options={renderLocationOptions()}
              onChange={onLocationChange}
              disabled={renderLocationOptions().length < 2}
              selectedList={selectedLocations}
              label="Location"
            />
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

export default connect(({ user, location, onboardingSettings }) => ({
  user,
  location,
  onboardingSettings,
}))(Header);
