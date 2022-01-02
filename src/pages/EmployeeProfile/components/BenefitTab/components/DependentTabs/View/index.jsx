import React from 'react';
import { formatMessage, connect } from 'umi';
import moment from 'moment';
import { isEmpty } from 'lodash';
import RemoveIcon from '../Edit/assets/removeIcon.svg';
import styles from './styles.less';

const DependentTabs = (props) => {
  const {
    dependentDetails = [],
    tenantCurrentEmployee = '',
    idCurrentEmployee = '',
    generalDataOrigin,
  } = props;
  const { firstName = '', lastName = '', legalGender = '', DOB = '' } = generalDataOrigin;
  const { data: viewData = [] } = props;
  const viewDataNew = viewData.length > 0 ? viewData[0] : [];
  const firstname = formatMessage({
    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.firstName',
  });
  const lastname = formatMessage({
    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.lastName',
  });
  const gender = formatMessage({
    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.gender',
  });
  const relationship = formatMessage({
    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.relationship',
  });
  const dob = formatMessage({
    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.dob',
  });

  const handleDeleteDependant = (value) => {
    const { dispatch } = props;
    const data = viewData.map((val) => {
      return val.dependents.filter((item) => item._id !== value);
    });
    const id = dependentDetails.length > 0 ? dependentDetails[0]._id : '';
    const dependents = data.length > 0 ? data[0] : [];
    dispatch({
      type: 'employeeProfile/updateEmployeeDependentDetails',
      payload: {
        dependents,
        id,
        tenantId: tenantCurrentEmployee,
        employee: idCurrentEmployee,
      },
    });
  };
  return (
    <div className={styles.tab}>
      <div className={styles.selft}>
        <div className={styles.selft__title}>Self</div>
        <div className={styles.containerSelft}>
          <div className={styles.containerSelft__title}>First Name</div>
          <div className={styles.containerSelft__content}>
            <p>{firstName}</p>
          </div>
        </div>
        <div className={styles.containerSelft}>
          <div className={styles.containerSelft__title}>Last Name</div>
          <div className={styles.containerSelft__content}>
            <p>{lastName}</p>
          </div>
        </div>
        <div className={styles.containerSelft}>
          <div className={styles.containerSelft__title}>Gender</div>
          <div className={styles.containerSelft__content}>
            <p>{legalGender}</p>
          </div>
        </div>
        <div className={styles.containerSelft}>
          <div className={styles.containerSelft__title}> Date of Birth</div>
          {DOB !== '' && DOB !== null ? (
            <div className={styles.containerSelft__content}>
              <p>{moment(DOB).locale('en').format('DD/MM/YYYY')}</p>
            </div>
          ) : (
            <div className={styles.containerSelft__content}> _ </div>
          )}
        </div>
      </div>
      {!isEmpty(viewDataNew) ? (
        <>
          {viewDataNew.dependents.map((data, index) => {
            return (
              <>
                {index > 0 && <div className={styles.line} />}
                <div className={styles.dependent}>
                  {formatMessage({
                    id: 'pages.employeeProfile.BenefitTab.components.dependentTabs.dependent',
                  })}
                  {index + 1}
                  <img
                    src={RemoveIcon}
                    alt="remove"
                    onClick={() => handleDeleteDependant(data._id)}
                  />
                </div>
                <div className={styles.info}>
                  {[firstname, lastname, gender, relationship, dob].map((item) => {
                    let foo = '';
                    switch (item) {
                      case firstname:
                        foo = data.firstName;
                        break;
                      case lastname:
                        foo = data.lastName;
                        break;
                      case gender:
                        foo = data.gender;
                        break;
                      case relationship:
                        foo = data.relationship;
                        break;
                      case dob:
                        foo = moment(data.dob).locale('en').format('DD/MM/YYYY');
                        break;
                      default:
                        return foo;
                    }
                    return (
                      <div key={Math.random().toString(36).substring(7)} className={styles.items}>
                        <div style={{ fontWeight: '500', width: '50%' }}>{item}</div>
                        <div style={{ color: '#707177', width: '50%' }}>
                          <p>{foo}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })}
        </>
      ) : (
        ''
      )}
    </div>
  );
};
export default connect(
  ({
    user: { currentUser: { employee = {} } = {} } = {},
    employeeProfile: {
      idCurrentEmployee = '',
      tenantCurrentEmployee = '',
      originData: { dependentDetails = [] } = {},
      originData: { generalData: generalDataOrigin = {} } = {},
    } = {},
  }) => ({
    generalDataOrigin,
    idCurrentEmployee,
    dependentDetails,
    tenantCurrentEmployee,
    employee,
  }),
)(DependentTabs);
