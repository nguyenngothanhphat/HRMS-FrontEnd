import React, { PureComponent } from 'react';
import { Row, Col, Button, Skeleton } from 'antd';
import { connect, history, formatMessage } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import { ONBOARDING_FORM_LINK, ONBOARDING_STEPS } from '@/constants/onboarding';
import Header from './components/Header';
import GlobalEmployeeComponent from './components/GlobalEmployeeComponent';
import NoteComponent from '../NewNoteComponent';
import styles from './index.less';
import MessageBox from '../MessageBox';

@connect(
  ({
    newCandidateForm: {
      data = {},
      currentStep = 0,
      tempData: { hidePreviewOffer = false, dateOfJoining = '' } = {},
      tempData = {},
      benefits,
    } = {},
    loading,
  }) => ({
    benefits,
    data,
    dateOfJoining,
    tempData,
    currentStep,
    hidePreviewOffer,
    loadingFetchCandidate: loading.effects['newCandidateForm/fetchCandidateByRookie'],
  }),
)
class Benefits extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listChecked: [],
    };
  }

  static getDerivedStateFromProps(props) {
    if ('benefits' in props) {
      return { benefits: props.benefits || {} };
    }
    return null;
  }

  componentDidMount() {
    window.scrollTo({ top: 77, behavior: 'smooth' }); // Back to top of the page
    this.fetchListBenefit();
  }

  fetchListBenefit = () => {
    const { dispatch, data: { workLocation: { headQuarterAddress: { country } = {} } = {} } = {} } =
      this.props;

    dispatch({
      type: 'newCandidateForm/fetchListBenefit',
      payload: { country: typeof country === 'object' ? country?._id : country },
    });
  };

  newHandleChange = (e, title, subCheckBox) => {
    const { benefits, listChecked } = this.state;
    const { dispatch } = this.props;
    const { checked, value: docVal } = e.target;

    const list = [...listChecked];

    const listDocuments = [];
    subCheckBox.forEach((sub) => {
      listDocuments.push(...sub.documents);
    });

    if (checked) {
      list.push(docVal);
    } else {
      const index = list.indexOf(docVal);
      if (index > -1) {
        list.splice(index, 1);
      }
    }

    if (title === 'Medical') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedMedical: list,
            medical: list.length === listDocuments.length,
          },
        },
      });
      this.setState({ listChecked: list });
    } else if (title === 'Dental') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedDental: list,
            dental: list.length === listDocuments.length,
          },
        },
      });
    } else if (title === 'Vision') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedVision: list,
            vision: list.length === listDocuments.length,
          },
        },
      });
    } else if (title === 'Life') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedLife: list,
            life: list.length === listDocuments.length,
          },
        },
      });
    } else if (title === 'shortTerm') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedShortTerm: list,
            shortTerm: list.length === listDocuments.length,
          },
        },
      });
    } else if (title === 'employeeProvident') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedEmployee: list,
            employeeProvident: list.length === listDocuments.length,
          },
        },
      });
    }
  };

  onChange = (e, title) => {
    const { target } = e;
    const { value, checked } = target;
    const { benefits } = this.state;
    const { vision, dental, paytmWallet, life, medical, shortTerm, employeeProvident } = benefits;
    const { dispatch } = this.props;

    if (title === 'Dental') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            dental: !dental,
            selectedDental: checked ? value : '',
          },
        },
      });
    } else if (title === 'Vision') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            vision: !vision,
            selectedVision: checked ? value : '',
          },
        },
      });
    } else if (title === 'Life') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            life: !life,
            selectedLife: checked ? value : '',
          },
        },
      });
    } else if (title === 'Medical') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            medical: !medical,
            selectedMedical: checked ? value : '',
          },
        },
      });
    } else if (title === 'shortTerm') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            shortTerm: !shortTerm,
            selectedShortTerm: checked ? value : '',
          },
        },
      });
    }
    if (title === 'Paytm Wallet') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            paytmWallet: !paytmWallet,
            selectedPaytmWallet: checked ? value : '',
          },
        },
      });
    } else if (title === 'Employee Provident Fund') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            employeeProvident: !employeeProvident,
            selectedEmployeeProvident: checked ? value : '',
          },
        },
      });
    }
  };

  getListSelectedMedical = (arr) => {
    const list = [];
    arr.forEach((item) => {
      list.push(...item.documents);
    });

    return list.map((item) => item.value);
  };

  handleCheckAll = (e, arr, title) => {
    const { benefits } = this.state;
    const { dispatch } = this.props;
    if (title === 'Medical') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedMedical: e.target.checked ? this.getListSelectedMedical(arr) : [],
            medical: e.target.checked,
          },
        },
      });
    } else if (title === 'Dental') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedDental: e.target.checked ? this.getListSelectedMedical(arr) : [],
            dental: e.target.checked,
          },
        },
      });
    } else if (title === 'Vision') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedVision: e.target.checked ? this.getListSelectedMedical(arr) : [],
            vision: e.target.checked,
          },
        },
      });
    } else if (title === 'Life') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedLife: e.target.checked ? this.getListSelectedMedical(arr) : [],
            life: e.target.checked,
          },
        },
      });
    } else if (title === 'shortTerm') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedShortTerm: e.target.checked ? this.getListSelectedMedical(arr) : [],
            shortTerm: e.target.checked,
          },
        },
      });
    } else if (title === 'employeeProvident') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedEmployee: e.target.checked ? this.getListSelectedMedical(arr) : [],
            employeeProvident: e.target.checked,
          },
        },
      });
    } else if (title === 'paytmWallet') {
      dispatch({
        type: 'newCandidateForm/save',
        payload: {
          benefits: {
            ...benefits,
            listSelectedPaytmWallet: e.target.checked ? this.getListSelectedMedical(arr) : [],
            paytmWallet: e.target.checked,
          },
        },
      });
    }
  };

  onClickNext = async () => {
    const {
      hidePreviewOffer,
      dispatch,
      currentStep,
      data: { _id = '' } = {},
      dateOfJoining = '',
    } = this.props;
    if (hidePreviewOffer) {
      dispatch({
        type: 'newCandidateForm/redirectToOnboardList',
      });
      return;
    }
    const nextStep = ONBOARDING_STEPS.OFFER_DETAILS;

    if (currentStep === ONBOARDING_STEPS.BENEFITS) {
      const res = await dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          currentStep: nextStep,
          candidate: _id,
          tenantId: getCurrentTenant(),
          dateOfJoining,
        },
      });
      if (res.statusCode === 200) {
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep: nextStep,
          },
        });
      }
    }

    const { tempData = {} } = this.props;
    const { ticketID = '' } = tempData;

    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.OFFER_DETAILS}`);
  };

  onClickPrev = () => {
    const { tempData = {} } = this.props;
    const { ticketID = '' } = tempData;

    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.SALARY_STRUCTURE}`);
  };

  _renderBottomBar = () => {
    const { currentStep } = this.props;

    const renderText = currentStep === ONBOARDING_STEPS.SALARY_STRUCTURE ? 'Next' : 'Update';
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={24}>
            <div className={styles.bottomBar__button}>
              <Row gutter={12}>
                <Col span={12}>
                  <Button
                    type="secondary"
                    onClick={this.onClickPrev}
                    className={styles.bottomBar__button__secondary}
                  >
                    Previous
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={this.onClickNext}
                    className={styles.bottomBar__button__primary}
                  >
                    {renderText}
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  getBenefitDocuments = (category) => {
    const { data: { benefits = [] } = {} } = this.props;
    const getBenefits = [];

    benefits.forEach((benefit) => {
      if (benefit.category === category) {
        const docs = [...benefit.documents];
        const documents = docs.map((doc) => {
          return {
            key: doc._id,
            value: doc.attachmentName,
          };
        });
        getBenefits.push({
          benefitsName: benefit.name,
          documents,
          createdAt: benefit.createdAt,
        });
      }
    });
    return getBenefits;
  };

  render() {
    const globalEmployeesCheckbox = {
      checkBox: [
        {
          value: formatMessage({ id: 'component.Benefits.medical' }),
          title: formatMessage({ id: 'component.Benefits.medical' }),
          // subCheckBox: [
          //   {
          //     key: 1,
          //     value: formatMessage({ id: 'component.Benefits.openAccess' }),
          //   },
          //   {
          //     key: 2,
          //     value: formatMessage({ id: 'component.Benefits.OAP' }),
          //   },
          // ],
          subCheckBox: this.getBenefitDocuments(
            formatMessage({ id: 'component.Benefits.medical' }),
          ),
        },
        {
          value: formatMessage({ id: 'component.Benefits.dental' }),
          title: formatMessage({ id: 'component.Benefits.dental' }),
          subCheckBox: this.getBenefitDocuments(formatMessage({ id: 'component.Benefits.dental' })),
        },
        {
          value: formatMessage({ id: 'component.Benefits.vision' }),
          title: formatMessage({ id: 'component.Benefits.vision' }),
          subCheckBox: this.getBenefitDocuments(formatMessage({ id: 'component.Benefits.vision' })),
        },
        {
          value: formatMessage({ id: 'component.Benefits.life' }),
          title: formatMessage({ id: 'component.Benefits.life' }),
          subCheckBox: this.getBenefitDocuments('Life Insurance'),
        },
        {
          value: formatMessage({ id: 'component.Benefits.shortTerm' }),
          title: formatMessage({ id: 'component.Benefits.shortTermTitle' }),
          subCheckBox: this.getBenefitDocuments('Short Term'),
        },
      ],
    };
    const IndiaEmployeesCheckbox = {
      checkBox: [
        {
          value: formatMessage({ id: 'component.Benefits.paytm' }),
          title: 'paytmWallet',
          subCheckBox: [
            // {
            //   key: 1,
            //   value: formatMessage({ id: 'component.Benefits.openAccess' }),
            // },
          ],
        },
        {
          value: formatMessage({ id: 'component.Benefits.Employee' }),
          title: formatMessage({ id: 'component.Benefits.employeeTitle' }),
          subCheckBox: [
            // {
            //   key: 1,
            //   value: formatMessage({ id: 'component.Benefits.openAccess' }),
            // },
            // {
            //   key: 2,
            //   value: formatMessage({ id: 'component.Benefits.OAP' }),
            // },
          ],
        },
      ],
    };

    const { benefits } = this.state;
    const { loadingFetchCandidate, data: { benefits: listBenefits = [] } = {} } = this.props;
    if (loadingFetchCandidate) return <Skeleton />;
    return (
      <>
        <Row gutter={[24, 0]}>
          <Col span={24} xl={16}>
            <div className={styles.Benefits}>
              <Header />
              <GlobalEmployeeComponent
                globalEmployeesCheckbox={globalEmployeesCheckbox}
                onChange={this.onChange}
                handleCheckAll={this.handleCheckAll}
                handleChange={this.handleChange}
                newHandleChange={this.newHandleChange}
                benefits={benefits}
                listBenefits={listBenefits}
              />
            </div>

            <div className={styles.bars}>{this._renderBottomBar()}</div>
          </Col>

          <Col span={24} xl={8}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <NoteComponent />
              </Col>
              <Col span={24}>
                <MessageBox />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}

export default Benefits;
