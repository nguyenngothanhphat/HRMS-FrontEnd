import React, { PureComponent } from 'react';
import { connect } from 'umi';
import Edit from './Edit';
import View from './View';
import styles from '../../index.less';

@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: { company: companyDetailsOrigin = {} } = {} },
      tempData: { companyDetails: { company: companyDetails = {} } = {} },
    } = {},
  }) => ({ companyDetailsOrigin, companyDetails }),
)
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
    const { companyDetailsOrigin, companyDetails, dispatch } = this.props;
    const {
      name = '',
      dba = '',
      ein = '',
      // employeeNumber = '',
      website = '',
    } = companyDetailsOrigin;
    const reverseFields = {
      name,
      dba,
      ein,
      // employeeNumber,
      website,
    };
    const payload = { ...companyDetails, ...reverseFields };
    const isModified = JSON.stringify(payload) !== JSON.stringify(companyDetailsOrigin);

    dispatch({
      type: 'companiesManagement/saveTemp',
      payload: { companyDetails: payload },
    });
    dispatch({
      type: 'companiesManagement/save',
      payload: { isModified },
    });
  };

  render() {
    const { isOpenEditDetail } = this.state;
    const { companyDetailsOrigin = {} } = this.props;
    const renderContentCompanyDetail = isOpenEditDetail ? (
      <Edit handleCancelEdit={this.handleCancelEdit} />
    ) : (
      <View information={companyDetailsOrigin} />
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
