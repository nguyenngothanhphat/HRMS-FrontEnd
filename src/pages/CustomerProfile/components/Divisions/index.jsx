import { Skeleton, Spin } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import CommonModal from '@/components/CommonModal';
import CustomAddButton from '@/components/CustomAddButton';
import CustomEditButton from '@/components/CustomEditButton';
import AddDivisionContent from './components/AddDivisionContent';
import DivisionItem from './components/DivisionItem';
import EditDivisionContent from './components/EditDivisionContent';
import styles from './index.less';

const Divisions = (props) => {
  const {
    dispatch,
    reId,
    divisions = [],
    listTags = [],
    info = {},
    country = [],
    state = [],
    loadingDivisions = false,
    loadingAdd = false,
    loadingUpdate = false,
  } = props;

  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [handlingPackage, setHandlingPackage] = React.useState({});
  const [isCountrySelected, setIsCountrySelected] = React.useState(true);

  useEffect(() => {
    dispatch({
      type: 'customerProfile/fetchDivision',
      payload: {
        id: reId,
      },
    });
  }, [reId]);

  const showModal = () => {
    setAddModalVisible(true);
    dispatch({
      type: 'customerProfile/generateDivisionId',
      payload: {
        id: reId,
      },
    });
  };

  useEffect(() => {
    if (addModalVisible || editModalVisible) {
      dispatch({
        type: 'customerManagement/fetchTagList',
        payload: {
          name: 'Engineering',
        },
      });
      dispatch({
        type: 'customerManagement/fetchCountryList',
      });
    }
  }, [addModalVisible, editModalVisible]);

  const onCloseModal = () => {
    setAddModalVisible(false);
    setEditModalVisible(false);
  };

  const handleSelectCountry = (values) => {
    dispatch({
      type: 'customerManagement/fetchStateByCountry',
      payload: values,
    });
    setIsCountrySelected(false);
  };

  const renderDivisionCard = (division) => {
    return (
      <div className={styles.DivisionCard}>
        {/* Header */}
        <div className={styles.divisionsHeader}>
          <span className={styles.contactInfoHeaderTitle}>
            {division?.divisionName || 'Division'}
          </span>
          <CustomEditButton
            onClick={() => {
              setHandlingPackage(division);
              setEditModalVisible(true);
            }}
          >
            Edit
          </CustomEditButton>
        </div>

        <div className={styles.divisionsBody}>
          <DivisionItem item={division} />
        </div>
      </div>
    );
  };

  return (
    <Spin spinning={loadingDivisions}>
      <div className={styles.Divisions}>
        {divisions.map((item, i) => {
          return renderDivisionCard(item, i);
        })}
        <div className={styles.addDivision}>
          <CustomAddButton onClick={showModal}>Add another Division</CustomAddButton>
        </div>
        <CommonModal
          title="Add Division"
          visible={addModalVisible}
          onClose={onCloseModal}
          loading={loadingAdd}
          content={
            <AddDivisionContent
              visible={addModalVisible}
              onCloseModal={onCloseModal}
              listTags={listTags}
              info={info}
              isCountrySelected={isCountrySelected}
              handleSelectCountry={handleSelectCountry}
              countryList={country}
              stateList={state}
              reId={reId}
            />
          }
        />

        <CommonModal
          title="Edit Division"
          visible={editModalVisible}
          onClose={onCloseModal}
          loading={loadingUpdate}
          content={
            <EditDivisionContent
              data={handlingPackage}
              visible={editModalVisible}
              onClose={() => {
                setEditModalVisible(false);
                setHandlingPackage({});
              }}
              listTags={listTags}
              info={info}
              isCountrySelected={isCountrySelected}
              handleSelectCountry={handleSelectCountry}
              countryList={country}
              stateList={state}
              reId={reId}
            />
          }
        />
      </div>
    </Spin>
  );
};

export default connect(
  ({
    loading,
    customerManagement: { country = [], state = [], listTags = [] } = {},
    customerProfile: { divisionId = '', info = {}, divisions = [] } = {},
  }) => ({
    info,
    divisions,
    country,
    state,
    listTags,
    divisionId,
    loadingDivisions: loading.effects['customerProfile/fetchDivision'],
    loadingAdd: loading.effects['customerProfile/addDivision'],
    loadingUpdate: loading.effects['customerProfile/updateDivision'],
  }),
)(Divisions);
