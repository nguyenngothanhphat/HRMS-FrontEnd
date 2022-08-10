import React, { PureComponent } from 'react';
import Edit from './Edit';
import View from './View';
import styles from '../../index.less';

class HeadquaterAddress extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenEditDetail: false,
    };
  }

  handleEdit = () => {
    this.setState({
      isOpenEditDetail: true,
    });
  };

  handleCancelEdit = () => {
    this.setState({
      isOpenEditDetail: false,
    });
  };

  render() {
    const { isOpenEditDetail } = this.state;
    const {
      headQuarterAddress = {
        name: '',
        addressLine1: '',
        country: '',
        state: '',
        zipCode: '',
        isheadQuarter: true,
      },
    } = this.props;

    const renderContentCompanyDetail = isOpenEditDetail ? (
      <Edit location={headQuarterAddress} handleCancelEdit={this.handleCancelEdit} />
    ) : (
      <View location={headQuarterAddress} />
    );

    return (
      <div className={styles.companyInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.companyInformation_title}>Headquarter Address</p>
          {isOpenEditDetail ? (
            ''
          ) : (
            <div className={styles.companyInformation_edit} onClick={this.handleEdit}>
              <img src="/assets/images/edit.svg" alt="Icon Edit" />
              <p className={styles.companyInformation_edit_text}>Edit</p>
            </div>
          )}
        </div>

        <div className={styles.viewBottom}>{renderContentCompanyDetail}</div>
      </div>
    );
  }
}

export default HeadquaterAddress;
