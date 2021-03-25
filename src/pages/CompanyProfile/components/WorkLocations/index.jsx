/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Form, Divider, Button, Skeleton, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import classnames from 'classnames';
import FormWorkLocation from './components/FormWorkLocation';
import FormWorkLocationTenant from './components/FormWorkLocation-Tenant';
import s from './index.less';

@connect(
  ({
    loading,
    country: { listCountry = [] } = {},
    companiesManagement: {
      locationsList: workLocations = [],
      originData: { companyDetails = {} } = {},
    } = {},
  }) => ({
    listCountry,
    workLocations,
    loading: loading.effects['companiesManagement/upsertLocationsList'],
    fetchingLocationsList: loading.effects['companiesManagement/fetchLocationsList'],
    loadingCountry: loading.effects['country/fetchListCountry'],
    companyDetails,
    loadingAddCompany: loading.effects['companiesManagement/addCompanyTenant'],
  }),
)
class WorkLocations extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, companyId = '' } = this.props;

    if (companyId) {
      dispatch({
        type: 'companiesManagement/fetchLocationsList',
        payload: { company: companyId },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'companiesManagement/save',
      payload: { locationsList: [] },
    });
  }

  onFinish = (values) => {
    const { dispatch, companyId = '', companyDetails } = this.props;
    const payload = { values, company: companyId };
    if (companyId) {
      dispatch({
        type: 'companiesManagement/upsertLocationsList',
        payload,
      });
    } else {
      // console.log('payload add new company', payload);
      companyDetails.locations = [...companyDetails.locations, ...values.workLocation];
      companyDetails.isNewTenant = true;
      dispatch({
        type: 'companiesManagement/addCompanyTenant',
        payload: companyDetails,
        dataTempKept: {},
        isAccountSetup: true,
      });
    }
  };

  formatListLocation = () => {
    const { workLocations = [] } = this.props;
    const formatData = workLocations.map((item) => {
      const { country: { _id: country } = {} } = item;
      return { ...item, country };
    });
    const listLocation = formatData.sort((item, nextItem) => {
      return moment.utc(item.createdAt).diff(moment.utc(nextItem.createdAt));
    });
    return listLocation;
  };

  removeLocation = (id) => {
    const { dispatch, companyId = '' } = this.props;
    const payload = { id, company: companyId };
    dispatch({
      type: 'companiesManagement/removeLocation',
      payload,
    });
  };

  render() {
    const {
      listCountry = [],
      workLocations = [],
      loading,
      fetchingLocationsList,
      loadingCountry,
      companyDetails = {},
    } = this.props;

    const listLocation = this.formatListLocation();

    const defaultListLocation = listLocation.length === 0 ? [{}] : listLocation;
    const {
      company: {
        headQuarterAddress: {
          addressLine1 = '',
          addressLine2 = '',
          country = '',
          state = '',
          zipCode = '',
        } = {},
      },
    } = companyDetails;

    if (fetchingLocationsList || loadingCountry)
      return (
        <div className={s.root}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Work Locations</p>
            <p className={s.text}>
              This information is used to assign the employees to the right office. We will also
              enable you to assign office specific administrators, filter employees per work
              location, view Business Intelligence reports, and more. You do not need to add the
              address of your remote employees here.
            </p>
          </div>
          <div className={s.content__viewBottom}>
            <Skeleton active />
          </div>
        </div>
      );

    return (
      <Form
        ref={this.formRef}
        onFinish={this.onFinish}
        autoComplete="off"
        initialValues={{
          addressLine2,
          zipCode,
          country,
          state,
          addressLine1,
          workLocations: defaultListLocation,
        }}
      >
        <div className={s.root}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Work Locations</p>
            <p className={s.text}>
              This information is used to assign the employees to the right office. We will also
              enable you to assign office specific administrators, filter employees per work
              location, view Business Intelligence reports, and more. You do not need to add the
              address of your remote employees here.
            </p>
          </div>
          <div className={s.content__viewBottom}>
            {/* <Form.List name="workLocations">
              {(fields) => (
                <>
                 {fields.map((field) => ( */}
            {/* <Form.Item name="companyDetails"> */}
            <FormWorkLocationTenant
              isRequired={false}
              name="Headquarter"
              companyDetails={companyDetails}
              formRef={this.formRef}
              listCountry={listCountry}
              listLocation={listLocation}
              defaultCountry="AF"
            />
            {/* </Form.Item> */}
            {/* ))}
                </>
              )} */}
            {/* </Form.List> */}
          </div>
        </div>
        <div className={s.root} style={{ marginTop: '24px' }}>
          <div className={s.content__viewBottom}>
            <Form.List name="workLocations">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <FormWorkLocation
                      field={field}
                      key={field.name}
                      isHidden={false}
                      name="New work location"
                      formRef={this.formRef}
                      listCountry={listCountry}
                      listLocation={listLocation}
                      removeLocation={this.removeLocation}
                      onRemove={() => remove(field.name)}
                    />
                  ))}
                  <div className={s.viewAddWorkLocation} onClick={() => add()}>
                    <p className={s.viewAddWorkLocation__icon}>
                      <PlusOutlined />
                    </p>
                    <p className={s.viewAddWorkLocation__text}>Add work location</p>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </div>
        <div className={s.viewBtn}>
          <Button className={s.btnSubmit} htmlType="submit" loading={loading}>
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

export default WorkLocations;
