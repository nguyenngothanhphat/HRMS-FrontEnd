import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentLocation } from '@/utils/authority';
import LocationDropdownSelector from '@/components/LocationDropdownSelector';
import styles from './index.less';

const Header = (props) => {
  const {
    dispatch,
    handleUploadDocument = () => {},
    onboardingSettings: {
      selectedLocations: selectedLocationsProp = [],
      locationsOfCountries = [],
    } = {},
  } = props;

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setSelectedLocations(selectedLocationsProp);
  }, [JSON.stringify(selectedLocationsProp)]);

  useEffect(() => {
    dispatch({
      type: 'onboardingSettings/getLocationsOfCountriesEffect',
    });
    return () => {
      setData([]);
      setSelectedLocations([]);
      dispatch({
        type: 'onboardingSettings/save',
        locationsOfCountries: [],
      });
    };
  }, []);

  useEffect(() => {
    const tempData = locationsOfCountries.map((x, i) => {
      return {
        title: x.country?.name,
        key: i,
        children: x.data.map((y) => {
          return {
            title: y.name,
            key: y._id,
          };
        }),
      };
    });
    setSelectedLocations([getCurrentLocation()]);
    setData(tempData);
    dispatch({
      type: 'onboardingSettings/save',
      payload: {
        selectedLocations: [getCurrentLocation()],
        isLocationLoaded: true,
      },
    });
  }, [JSON.stringify(locationsOfCountries)]);

  const onLocationChange = (value) => {
    dispatch({
      type: 'onboardingSettings/save',
      payload: {
        selectedLocations: value,
      },
    });
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
            <LocationDropdownSelector
              saveLocationToRedux={onLocationChange}
              selectedLocations={selectedLocations}
              data={data}
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
