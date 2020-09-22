import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import { connect } from 'umi';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

@connect(
  ({
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    generalDataOrigin,
    generalData,
  }),
)
class PassportVisaInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  handleEdit = () => {
    this.setState({
      isEdit: true,
    });
  };

  handleCancel = () => {
    const { generalDataOrigin, generalData, dispatch } = this.props;
    this.setState({
      isEdit: false,
    });
    const {
      passportNo = '',
      passportIssueCountry = '',
      passportIssueOn = '',
      passportValidTill = '',
      visaNo = '',
      visaType = '',
      visaCountry = '',
      visaEntryType = '',
      visaIssuedOn = '',
      visaValidTill = '',
    } = generalDataOrigin;
    const reverseFields = {
      passportNo,
      passportIssueCountry,
      passportIssueOn,
      passportValidTill,
      visaNo,
      visaType,
      visaCountry,
      visaEntryType,
      visaIssuedOn,
      visaValidTill,
    };
    const payload = { ...generalData, ...reverseFields };
    const isModified = JSON.stringify(payload) !== JSON.stringify(generalDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: payload },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  render() {
    const { generalData } = this.props;
    const { isEdit } = this.state;
    const renderComponent = isEdit ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View dataAPI={generalData} />
    );
    return (
      <div className={styles.PassportVisaInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Passport and Visa Information</p>
          {isEdit ? (
            ''
          ) : (
            <div className={styles.flexEdit} onClick={this.handleEdit}>
              <EditFilled className={styles.IconEdit} />
              <p className={styles.Edit}>Edit</p>
            </div>
          )}
        </div>
        <div className={styles.viewBottom}>{renderComponent}</div>
      </div>
    );
  }
}

export default PassportVisaInformation;
