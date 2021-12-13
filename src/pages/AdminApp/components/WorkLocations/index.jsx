import React, { PureComponent } from 'react';
import { Form, Button, Skeleton, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import moment from 'moment';

import { connect } from 'umi';
// import ThirdStep from '@/pages/EmployeeProfile/components/EmploymentTab/components/HandleChanges/components/ThirdStep';
import FormWorkLocation from './components/FormWorkLocation';
import FormWorkLocationTenant from './components/FormWorkLocation-Tenant';
import s from './index.less';

@connect(
  ({
    loading,
    country: { listCountry = [] } = {},
    companiesManagement: { originData: { companyDetails = {} } = {} } = {},
    adminApp: { locationsList = [] },
    user: { currentUser: { manageTenant = [] } = {} } = {},
  }) => ({
    listCountry,
    locationsList,
    fetchingLocationsList: loading.effects['adminApp/fetchLocationList'],
    loadingCountry: loading.effects['country/fetchListCountry'],
    loadingAddMultiLocation: loading.effects['companiesManagement/addMultiLocation'],
    companyDetails,
    manageTenant,
  }),
)
class WorkLocations extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      isFillingIn: false,
    };
  }

  componentDidMount() {
    const { dispatch, companyId = '' } = this.props;
    const tenantId = getCurrentTenant();
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

  addLocationAPI = async (values) => {
    const tenantId = getCurrentTenant();
    const companyId = getCurrentCompany();

    const { dispatch, manageTenant = [] } = this.props;
    // const { company, isNewTenant, locations: originLocations = [] } = companyDetails;
    // const listLocation = [...originLocations, ...locations];
    const { workLocations = [] } = values;
    const formatListLocation = workLocations.map((location) => {
      const {
        name = '',
        addressLine1 = '',
        addressLine2 = '',
        city = '',
        country = '',
        state = '',
        zipCode = '',
      } = location;
      return {
        name,
        headQuarterAddress: {
          addressLine1,
          addressLine2,
          city,
          country: country || country?._id || '',
          state,
          zipCode,
        },
        legalAddress: {
          addressLine1,
          addressLine2,
          city,
          country: country || country?._id || '',
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
      // refresh work locations list
      dispatch({
        type: 'adminApp/fetchLocationList',
        payload: { company: companyId, tenantId },
      });
      // refresh locations in dropdown menu (owner)
      dispatch({
        type: 'locationSelection/fetchLocationListByParentCompany',
        payload: {
          company: companyId,
          tenantIds: manageTenant,
        },
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
    const tenantId = getCurrentTenant();
    const companyId = getCurrentCompany();

    const { dispatch, manageTenant = [] } = this.props;
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
      dispatch({
        type: 'locationSelection/fetchLocationListByParentCompany',
        payload: {
          company: companyId,
          tenantIds: manageTenant,
        },
      });
    }
  };

  formatCurrentLocationList = (locationsList) => {
    let list = locationsList.map((location) => {
      const {
        _id = '',
        name = '',
        headQuarterAddress: {
          addressLine1 = '',
          addressLine2 = '',
          city = '',
          country = {},
          state = '',
          zipCode = '',
        } = {},
        isHeadQuarter = false,
      } = location;
      return {
        _id,
        name,
        addressLine1,
        addressLine2,
        city,
        country: country?._id || '',
        state,
        zipCode,
        isHeadQuarter,
      };
    });

    // these lines to move the headquarter to top of array
    const headQuarter = list.find((item) => item.isHeadQuarter);
    list = list.filter((item) => !item.isHeadQuarter);
    list.unshift(headQuarter);
    return list;
  };

  trackingEditButton = (value) => {
    this.setState({
      isFillingIn: value,
    });
  };

  render() {
    const {
      listCountry = [],
      locationsList = [],
      fetchingLocationsList,
      loadingCountry,
      loadingAddMultiLocation = false,
    } = this.props;

    const { isFillingIn } = this.state;

    const listLocation = this.formatListLocation();

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
            {formatCurrentLocationsList.map((location, index) => {
              return (
                <FormWorkLocationTenant
                  isRequired={false}
                  defaultCountry={location?.country}
                  listCountry={listCountry}
                  listLocation={listLocation}
                  locationInfo={location}
                  trackingEditButton={this.trackingEditButton}
                  removeLocation={this.removeLocation}
                  listLength={formatCurrentLocationsList.length}
                  index={index}
                  handleEditLocation={this.handleEditLocation}
                />
              );
            })}
          </div>
        </div>

        <Form
          ref={this.formRef}
          onFinish={this.addLocationAPI}
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
                        onRemove={() => {
                          remove(field.name);
                        }}
                      />
                    ))}
                    <div className={s.actions}>
                      <Button
                        disabled={isFillingIn}
                        className={s.viewAddWorkLocation}
                        icon={
                          <p className={s.viewAddWorkLocation__icon}>
                            <PlusOutlined />
                          </p>
                        }
                        onClick={() => {
                          add();
                        }}
                      >
                        <p className={s.viewAddWorkLocation__text}>Add work location</p>
                      </Button>
                      {fields.length !== 0 && (
                        <div className={s.viewBtn}>
                          <Button
                            loading={loadingAddMultiLocation}
                            className={s.btnSubmit}
                            htmlType="submit"
                          >
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
