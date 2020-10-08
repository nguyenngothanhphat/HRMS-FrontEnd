import React, { PureComponent } from 'react';
import Edit from './Edit';
import View from './View';
import styles from '../../index.less';

class Information extends PureComponent {
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
    const renderContentCompanyDetail = isOpenEditDetail ? (
      <Edit handleCancelEdit={this.handleCancelEdit} />
    ) : (
      <View />
    );

    return (
      <div className={styles.companyInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.companyInformation_title}>Company Information</p>
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

export default Information;
