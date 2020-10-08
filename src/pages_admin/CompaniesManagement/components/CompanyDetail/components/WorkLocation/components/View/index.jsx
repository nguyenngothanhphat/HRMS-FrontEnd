import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import Edit from '../Edit';
import styles from './index.less';

class View extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenEditWorkLocation: false,
    };
  }

  handleEdit = () => {
    this.setState({
      isOpenEditWorkLocation: true,
    });
  };

  handleCancelEdit = () => {
    this.setState({
      isOpenEditWorkLocation: false,
    });
  };

  renderContentCompanyDetail = (location, isOpenEditWorkLocation) => {
    return (
      <>
        {isOpenEditWorkLocation ? (
          <Edit handleCancelEdit={this.handleCancelEdit} />
        ) : (
          <View location={location} />
        )}
      </>
    );
  };

  render() {
    const { location } = this.props;
    const { isOpenEditWorkLocation } = this.state;
    return (
      <div className={styles.view_workLocation}>
        <div className={styles.spaceTitle}>
          <p className={styles.view_workLocation_title}>{location.name}</p>
          {isOpenEditWorkLocation ? (
            ''
          ) : (
            <div className={styles.flexEdit} onClick={this.handleEdit}>
              <img src="/assets/images/edit.svg" alt="Icon Edit" />
              <p className={styles.Edit}>Edit</p>
            </div>
          )}
        </div>
        {isOpenEditWorkLocation ? (
          <Edit handleCancelEdit={this.handleCancelEdit} />
        ) : (
          <Row gutter={[0, 16]} className={styles.view_workLocation_content}>
            <>
              <Col span={6} className={styles.textLabel}>
                Address
              </Col>
              <Col span={18} className={styles.textValue}>
                {location.address}
              </Col>
              <Col span={6} className={styles.textLabel}>
                State
              </Col>
              <Col span={18} className={styles.textValue}>
                {location.state}
              </Col>
              <Col span={6} className={styles.textLabel}>
                Country
              </Col>
              <Col span={18} className={styles.textValue}>
                {location.country}
              </Col>
              <Col span={6} className={styles.textLabel}>
                ZipCode
              </Col>
              <Col span={18} className={styles.textValue}>
                {location.zipCode}
              </Col>
            </>
          </Row>
        )}
      </div>
    );
  }
}

export default View;
