import React, { PureComponent } from 'react';
import { connect } from 'umi';
import View from './components/View';
import Edit from './components/Edit';
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
class ProfessionalAcademicBackground extends PureComponent {
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
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  render() {
    const { isEdit } = this.state;
    const renderComponent = isEdit ? <Edit handleCancel={this.handleCancel} /> : <View />;
    return (
      <div className={styles.root}>
        <div className={styles.viewTitle}>
          <p className={styles.viewTitle__text}>Professional &amp; Academic Background</p>
          <div className={styles.viewTitle__edit} onClick={this.handleEdit}>
            <img
              src="/assets/images/edit.svg"
              alt="edit"
              className={styles.viewTitle__edit__icon}
            />
            <p className={styles.viewTitle__edit__text}>Edit</p>
          </div>
        </div>
        <div className={styles.viewBottom} style={isEdit ? { padding: 0 } : {}}>
          {renderComponent}
        </div>
      </div>
    );
  }
}

export default ProfessionalAcademicBackground;
