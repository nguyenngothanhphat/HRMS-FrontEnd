/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Form, Divider, Button, Skeleton, Input, Select, notification } from 'antd';
import { ConsoleSqlOutlined, PlusOutlined } from '@ant-design/icons';
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
    companiesManagement: { originData: { companyDetails = {} } = {} } = {},
    adminApp: { locationsList = [] },
  }) => ({
    listCountry,
    locationsList,
    fetchingLocationsList: loading.effects['adminApp/fetchLocationList'],
    loadingCountry: loading.effects['country/fetchListCountry'],
    companyDetails,
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
    const tenantId = localStorage.getItem('tenantId');
    if (companyId) {
      dispatch({
        type: 'adminApp/fetchLocationList',
        payload: { company: companyId, tenantId },
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

  onFinish = async (values) => {
    const tenantId = localStorage.getItem('tenantId');
    const companyId = localStorage.getItem('currentCompanyId');

    const { dispatch, companyDetails = {} } = this.props;
    // const { company, isNewTenant, locations: originLocations = [] } = companyDetails;
    // const listLocation = [...originLocations, ...locations];
    const { workLocations = [] } = values;
    const formatListLocation = workLocations.map((location) => {
      const {
        name = '',
        addressLine1 = '',
        addressLine2 = '',
        country = '',
        state = '',
        zipCode = '',
      } = location;
      return {
        name,
        headQuarterAddress: {
          addressLine1,
          addressLine2,
          country,
          state,
          zipCode,
        },
        legalAddress: {
          addressLine1,
          addressLine2,
          country,
          state,
          zipCode,
        },
        isHeadQuarter: false,
      };
    });

    const payload = {
      locations: formatListLocation,
      company: companyId,
      tenantId,
    };

    const res = await dispatch({
      type: 'companiesManagement/addMultiLocation',
      payload,
    });
    const { statusCode } = res;
    if (statusCode === 200) {
      notification.success({
        message: 'Add new locations successfully.',
      });
      dispatch({
        type: 'adminApp/fetchLocationList',
        payload: { company: companyId, tenantId },
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

  removeLocation = async (id) => {
    const tenantId = localStorage.getItem('tenantId');
    const companyId = localStorage.getItem('currentCompanyId');

    const { dispatch } = this.props;
    const payload = { id, tenantId };
    const res = await dispatch({
      type: 'adminApp/removeLocation',
      payload,
    });
    const { statusCode } = res;
    if (statusCode === 200) {
      dispatch({
        type: 'adminApp/fetchLocationList',
        payload: { company: companyId, tenantId },
      });
    }
  };

  formatCurrentLocationList = (locationsList) => {
    return locationsList.map((location) => {
      const {
        _id = '',
        name = '',
        headQuarterAddress: {
          addressLine1 = '',
          addressLine2 = '',
          country = '',
          state = '',
          zipCode = '',
        } = {},
      } = location;
      return {
        _id,
        name,
        addressLine1,
        addressLine2,
        country,
        state,
        zipCode,
      };
    });
  };

  render() {
    const {
      listCountry = [],
      locationsList = [],
      loading,
      fetchingLocationsList,
      loadingCountry,
      companyDetails = {},
    } = this.props;

    const listLocation = this.formatListLocation();

    const defaultListLocation = [{}];

    if (fetchingLocationsList || loadingCountry)
      return (
        <div className={s.WorkLocations}>
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
        </div>
      );

    const formatCurrentLocationsList = this.formatCurrentLocationList(locationsList);

    return (
      <div className={s.WorkLocations}>
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
            {/* <FormWorkLocationTenant
              listCountry={listCountry}
              listLocation={listLocation}
              locationInfo={locationHeadquarter}
              isHeadQuarter
            /> */}
            {formatCurrentLocationsList.map((location, index) => {
              return (
                <FormWorkLocationTenant
                  isRequired={false}
                  listCountry={listCountry}
                  listLocation={listLocation}
                  locationInfo={location}
                  removeLocation={this.removeLocation}
                  listLength={formatCurrentLocationsList.length}
                  index={index}
                />
              );
            })}
          </div>
        </div>

        <Form
          ref={this.formRef}
          onFinish={this.onFinish}
          autoComplete="off"
          initialValues={
            {
              // workLocations: defaultListLocation,
            }
          }
        >
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
                    <div className={s.actions}>
                      <div className={s.viewAddWorkLocation} onClick={() => add()}>
                        <p className={s.viewAddWorkLocation__icon}>
                          <PlusOutlined />
                        </p>
                        <p className={s.viewAddWorkLocation__text}>Add work location</p>
                      </div>
                      {fields.length > 0 && (
                        <div className={s.viewBtn}>
                          <Button className={s.btnSubmit} htmlType="submit">
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </Form.List>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default WorkLocations;
