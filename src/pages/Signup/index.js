import React from 'react';
import { connect } from 'dva';
// import { formatMessage } from 'umi-plugin-react/locale';
import { Row } from 'antd';
import PageLoading from '@/components/PageLoading';
import styles from './index.less';
import Step01 from './Step_1';
// import Step02 from './Step_2';
// import Step03 from './Step_3';
// import Step04 from './Step_4';
import Step05 from './Step_5';
import Step06 from './Step_1_2';

@connect(({ signup, loading }) => ({
  signup,
  submitting: loading.effects['signup/signup'],
}))
class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      user: {},
      company: {},
      location: {},
      newLocation: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'currency/fetch' });
    dispatch({ type: 'locations/getAllCountry' });
    dispatch({ type: 'signup/resetData' });
    this.setState({
      step: 0,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      signup: {
        validAdmin = false,
        validCompany = false,
        validLocation = false,
        signupSuccessful = false,
      },
    } = nextProps;
    const { user = {}, company = {}, newLocation = [] } = this.state;
    if (validAdmin && validCompany && validLocation && !signupSuccessful) {
      const data = {
        newCompany: company || {},
        newLocations: newLocation || [],
        newAdmin: user || {},
      };
      dispatch({ type: 'signup/onSignupAdmin', payload: data });
      this.setState({
        step: -1,
      });
    } else if (signupSuccessful) {
      this.setState({
        step: 4,
      });
    } else if (!validAdmin && !validCompany && !validLocation) {
      this.setState({
        step: 0,
      });
    } else if (!validAdmin || !validCompany || !validLocation) {
      this.setState({
        step: 5,
      });
    } else {
      this.setState({
        step: 5,
      });
    }
  }

  renderSteps = () => {
    const { dispatch } = this.props;
    const { step, user = {}, company = {}, location = {} } = this.state;
    switch (step) {
      case -1:
        return <PageLoading size="small" />;
      case 0:
        return (
          <Step01
            email={user.email || ''}
            onChangeStep={(stepInd, newEmail) => {
              user.email = newEmail;
              const data = {
                id: 'BASIC',
              };
              dispatch({ type: 'setting/getSuiteEdition', payload: data });
              this.setState({
                step: stepInd,
                user,
              });
            }}
          />
        );
      // case 1:
      //   return (
      //     <Step02
      //       email={user.email || ''}
      //       firstName={user.firstName || ''}
      //       phone={user.phone || ''}
      //       onBack={(stepInd, newEmail) => {
      //         user.email = newEmail;
      //         this.setState({
      //           step: stepInd,
      //           user,
      //         });
      //       }}
      //       onChangeStep={userInfo => {
      //         let userObj = user;
      //         userInfo.map(item => {
      //           userObj = { ...userObj, ...{ [item.type]: item.value } };
      //           return userObj;
      //         });
      //         const validData = {
      //           email: userObj.email,
      //           firstName: userObj.firstName,
      //           phone: userObj.phone,
      //         };
      //         dispatch({ type: 'signup/validAdmin', payload: validData });
      //         this.setState({
      //           step: -1,
      //           user: userObj,
      //         });
      //       }}
      //     />
      //   );
      // case 2:
      //   return (
      //     <Step03
      //       item={company}
      //       onBack={stepInd => {
      //         this.setState({
      //           step: stepInd,
      //         });
      //       }}
      //       onChangeStep={data => {
      //         let companyObj = company;
      //         data.map(item => {
      //           companyObj = { ...companyObj, ...{ [item.type]: item.value } };
      //           return companyObj;
      //         });
      //         dispatch({ type: 'signup/validCompany', payload: companyObj });
      //         this.setState({
      //           step: -1,
      //           company: companyObj,
      //         });
      //       }}
      //     />
      //   );
      // case 3:
      //   return (
      //     <Step04
      //       item={location}
      //       onBack={stepInd => {
      //         this.setState({
      //           step: stepInd,
      //         });
      //       }}
      //       onChangeStep={data => {
      //         let locationObj = location;
      //         data.map(item => {
      //           locationObj = { ...locationObj, ...{ [item.type]: item.value } };
      //           return locationObj;
      //         });
      //         dispatch({ type: 'signup/validLocation', payload: locationObj });
      //         this.setState({
      //           step: -1,
      //           location: locationObj,
      //         });
      //       }}
      //     />
      //   );
      case 4:
        return <Step05 email={user.email} />;
      case 5:
        return (
          <Step06
            email={user.email || ''}
            firstName={user.firstName || ''}
            company={company || {}}
            locationList={location || []}
            onBack={(stepInd, newEmail) => {
              user.email = newEmail;
              this.setState({
                step: stepInd,
                user,
              });
            }}
            onChangeStep={(admin, validCompany, locationList) => {
              dispatch({ type: 'signup/validAdmin', payload: admin });
              dispatch({ type: 'signup/validCompany', payload: validCompany });
              this.setState({
                step: -1,
                newLocation: locationList,
                company: validCompany,
                user: admin,
              });
            }}
          />
        );
      default:
        return (
          <Step01
            email={user.email || ''}
            onChangeStep={(stepInd, newEmail) => {
              user.email = newEmail;
              this.setState({
                step: stepInd,
                user,
              });
            }}
          />
        );
    }
  };

  render() {
    return (
      <Row align="middle" className={styles.signup_component}>
        {this.renderSteps()}
      </Row>
    );
  }
}

export default Signup;
