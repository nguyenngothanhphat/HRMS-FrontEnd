import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Modal } from 'antd';
import { formatMessage, connect } from 'umi';
import Edit from '../Edit';
import styles from './index.less';

const { confirm } = Modal;

@connect(({ companiesManagement }) => ({ companiesManagement }))
class View extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenEditWorkLocation: false,
    };
  }

  componentWillUnmount() {
    Modal.destroyAll();
  }

  handleEdit = () => {
    const {
      dispatch,
      companiesManagement: { isOpenEditWorkLocation = false },
    } = this.props;
    if (isOpenEditWorkLocation) {
      this.showConfirm();
    } else {
      this.setState({
        isOpenEditWorkLocation: true,
      });
      dispatch({
        type: 'companiesManagement/save',
        payload: {
          isOpenEditWorkLocation: true,
        },
      });
    }
  };

  handleCancelEdit = () => {
    const { dispatch } = this.props;
    this.setState({
      isOpenEditWorkLocation: false,
    });
    dispatch({
      type: 'companiesManagement/save',
      payload: {
        isOpenEditWorkLocation: false,
      },
    });
  };

  showConfirm = () => {
    const _this = this;
    confirm({
      title: 'Please save form or cancel before proceeding !',
      centered: true,
      cancelButtonProps: { style: { display: 'none' } },
      className: styles.view__confirm,
      onOk() {
        _this.saveChanges();
      },
    });
  };

  saveChanges = () => {};

  render() {
    const { location } = this.props;
    const {
      headQuarterAddress: {
        addressLine1: headAddressLine1 = '',
        addressLine2: headAddressLine2 = '',
        country = {},
        state = '',
        zipCode = '',
      } = {},
    } = location;

    const locationData = [
      {
        label: formatMessage({ id: 'pages_admin.company.location.addressLine1' }),
        value: headAddressLine1,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.addressLine2' }),
        value: headAddressLine2,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.country' }),
        value: country?.name,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.state' }),
        value: state,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.location.zipCode' }),
        value: zipCode,
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
            <div className={styles.flexEdit} onClick={() => this.handleEdit()}>
              <img src="/assets/images/edit.svg" alt="Icon Edit" />
              <p className={styles.Edit}>Edit</p>
            </div>
          )}
        </div>
        {isOpenEditWorkLocation ? (
          <Edit location={location} handleCancelEdit={() => this.handleCancelEdit()} />
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
