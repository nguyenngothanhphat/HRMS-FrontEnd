import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { formatMessage } from 'umi';
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

  // renderContentCompanyDetail = (location, isOpenEditWorkLocation) => {
  //   return (
  //     <>
  //       {isOpenEditWorkLocation ? (
  //         <Edit handleCancelEdit={this.handleCancelEdit} />
  //       ) : (
  //         <View location={location} />
  //       )}
  //     </>
  //   );
  // };

  render() {
    const { location } = this.props;
    const locationData = [
      {
        label: formatMessage({ id: 'pages_admin.company.location.address' }),
        value: location.address,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.country' }),
        value: location.country,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.state' }),
        value: location.state,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.zipCode' }),
        value: location.zipCode,
      },
    ];
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
            {locationData.map((item) => (
              <Fragment key={item.label}>
                <Col span={6} className={styles.textLabel}>
                  {item.label}
                </Col>
                <Col span={18} className={styles.textValue}>
                  {item.value}
                </Col>
              </Fragment>
            ))}
          </Row>
        )}
      </div>
    );
  }
}

export default View;
