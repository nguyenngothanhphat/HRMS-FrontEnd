import React, { PureComponent } from 'react';
import Edit from './Edit';
import View from '../HeadquaterAddress/View';
import styles from '../../index.less';

class LegalAddress extends PureComponent {
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
      legalAddress = {
        name: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
        state: '',
        zipCode: '',
        isheadQuarter: true,
      },
    } = this.props;
    const renderContentCompanyDetail = isOpenEditDetail ? (
      <Edit location={legalAddress} handleCancelEdit={this.handleCancelEdit} />
    ) : (
      <View location={legalAddress} />
    );

    return (
      <div className={styles.companyInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.companyInformation_title}>Legal Address</p>
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

export default LegalAddress;
