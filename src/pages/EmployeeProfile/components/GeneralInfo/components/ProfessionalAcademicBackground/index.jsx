import React, { PureComponent } from 'react';
import { connect } from 'umi';
import View from './components/View';
import Edit from './components/Edit';
import styles from './index.less';

@connect(
  ({
    employeeProfile: {
      editGeneral: { openAcademic = false },
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    generalDataOrigin,
    generalData,
    openAcademic,
  }),
)
class ProfessionalAcademicBackground extends PureComponent {
  handleEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openAcademic: true },
    });
  };

  handleCancel = () => {
    const { generalDataOrigin, generalData, dispatch } = this.props;
    const {
      preJobTitle = '',
      skills = [],
      preCompany = '',
      pastExp = 0,
      totalExp = 0,
      qualification = '',
      certification = [],
    } = generalDataOrigin;
    const reverseFields = {
      preJobTitle,
      skills,
      preCompany,
      pastExp,
      totalExp,
      qualification,
      certification,
    };
    const payload = { ...generalData, ...reverseFields };
    const isModified = JSON.stringify(payload) !== JSON.stringify(generalDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: payload },
    });
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openAcademic: false },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  render() {
    const { openAcademic, permissions = {}, profileOwner = false } = this.props;
    const renderComponent = openAcademic ? (
      <Edit profileOwner={profileOwner} handleCancel={this.handleCancel} />
    ) : (
      <View />
    );
    return (
      <div className={styles.root}>
        <div className={styles.viewTitle}>
          <p className={styles.viewTitle__text}>Professional &amp; Academic Background</p>
          {!openAcademic && (permissions.editProfessionalAcademic !== -1 || profileOwner) && (
            <div className={styles.viewTitle__edit} onClick={this.handleEdit}>
              <img
                src="/assets/images/edit.svg"
                alt="edit"
                className={styles.viewTitle__edit__icon}
              />
              <p className={styles.viewTitle__edit__text}>Edit</p>
            </div>
          )}
        </div>
        <div className={styles.viewBottom} style={openAcademic ? { padding: 0 } : {}}>
          {renderComponent}
        </div>
      </div>
    );
  }
}

export default ProfessionalAcademicBackground;
