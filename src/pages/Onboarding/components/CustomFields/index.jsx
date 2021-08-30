import { Button, Table, Spin } from 'antd';
import React, { PureComponent } from 'react';
import { history, formatMessage, connect } from 'umi';
import iGirl from '@/assets/Group1404.svg';
import trash from '@/assets/trash-customField.svg';
import edit from '@/assets/edit-customField.svg';
import group from '@/assets/Group-customField.svg';
import styles from './index.less';

@connect(({ loading, custormField: { section = [] } = {} }) => ({
  loadingCustom: loading.effects['custormField/fetchSection'],
  section,
}))
class CustomFields extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'custormField/fetchSection',
    });
  }

  handleAddNewSection = () => {
    history.push('/onboarding/CreateFieldSection');
  };

  handleAddNewField = () => {
    history.push('/onboarding/CreateNewField');
  };

  handleData = (data) => {
    data.map((item) => {
      return item;
    });
  };

  render() {
    const columns = [
      {
        title: formatMessage({ id: 'pages.OnboardingCustomField.sectionName' }),
        dataIndex: 'sectionName',
        key: 'sectionName',
        width: '230px',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index % 2 === 0) {
            obj.props.rowSpan = 2;
          }
          if (index % 2 === 1) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: formatMessage({ id: 'pages.OnboardingCustomField.fieldName' }),
        dataIndex: 'fieldName',
        key: 'fieldName',
        width: '50%',
        padding: '16px',
      },
      {
        title: formatMessage({ id: 'pages.OnboardingCustomField.actions' }),
        dataIndex: 'actions',
        key: 'actions',
        render: () => {
          return (
            <div className={styles.actionIcon}>
              <div>
                <img src={trash} alt="" className={styles.iconTrash} />
                <img src={edit} alt="" className={styles.iconEdit} />
              </div>
              <div>
                <img src={group} alt="" className={styles.iconGroup} />
              </div>
            </div>
          );
        },
      },
    ];
    const { loadingCustom = false, section } = this.props;

    const formatData = section.map((item, index) => {
      return [
        {
          key: index * 2 + 1,
          sectionName: item.name,
          fieldName: 'Inside sales_ commission plan',
        },
        {
          key: index * 2 + 2,
          sectionName: item.name,
          fieldName: 'Additional Information',
        },
      ];
    });

    // const mergedData = [].concat.apply([], formatData);
    const mergedData = formatData.flat(1);

    if (loadingCustom)
      return (
        <div className={styles.viewLoading}>
          <Spin size="large" loading={loadingCustom} className={styles.loadingCustom} />
        </div>
      );
    return (
      <div className={styles.CustomFields}>
        <div className={styles.CustomFieldsTop}>
          <div className={styles.contentLeft}>
            <h2 className={styles.contentLeftTitle}>
              {formatMessage({ id: 'pages.OnboardingCustomField.customFields' })}
            </h2>
            <p className={styles.contentLeftText}>
              {formatMessage({ id: 'pages.OnboardingCustomField.text' })}
            </p>
            <div>
              <Button className={styles.buttonAddNewSection} onClick={this.handleAddNewSection}>
                {formatMessage({ id: 'pages.OnboardingCustomField.addNewSection' })}
              </Button>
              <Button className={styles.buttonAddNewField} onClick={this.handleAddNewField}>
                {formatMessage({ id: 'pages.OnboardingCustomField.addNewField' })}
              </Button>
            </div>
          </div>
          <div className={styles.imgContentRight}>
            <img src={iGirl} alt="not found" />
          </div>
        </div>
        <div className={styles.CustomFieldsBotBackGround}>
          <p className={styles.CustomFieldsBotTitle}>
            {formatMessage({ id: 'pages.OnboardingCustomField.customSections&Fields' })}
          </p>
          <div className={styles.CustomFieldsBot}>
            <Table columns={columns} dataSource={mergedData} pagination={false} size="small" />
          </div>
        </div>
      </div>
    );
  }
}

export default CustomFields;
