import React, { Component, Fragment } from 'react';
import { Row, Col, Tag } from 'antd';
import { connect } from 'umi';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

@connect(({ employeeProfile: { tempData: { generalData = {} } = {}, listTitle = [] } = {} }) => ({
  generalData,
  listTitle,
}))
class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      linkImage: '',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      // , tenantCurrentEmployee = ''
    } = this.props;
    const tenantId = getCurrentTenant();
    const companyCurrentEmployee = getCurrentCompany();
    dispatch({
      type: 'employeeProfile/fetchListSkill',
    });
    dispatch({
      type: 'employeeProfile/fetchListTitle',
      payload: {
        // tenantId: tenantCurrentEmployee,
        payload: { company: companyCurrentEmployee, tenantId },
      },
    });
  }

  handleOpenModalReview = (linkImage) => {
    this.setState({
      visible: true,
      linkImage,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      this.setState({
        linkImage: '',
      });
    }, 500);
  };

  formatListSkill = (skills, otherSkills, colors) => {
    let temp = 0;
    const listFormat = skills.map((item) => {
      if (temp >= 5) {
        temp -= 5;
      }
      temp += 1;
      return {
        color: colors[temp - 1],
        name: item.name,
        id: item._id,
      };
    });
    const listFormatOther = otherSkills.map((item) => {
      if (temp >= 5) {
        temp -= 5;
      }
      temp += 1;
      return {
        color: colors[temp - 1],
        name: item,
        id: item,
      };
    });
    return [...listFormat, ...listFormatOther];
  };

  _renderListCertification = (list) => {
    return list.map((item, index) => {
      const { name = '', urlFile = '', _id = '' } = item;
      const nameFile = urlFile.split('/').pop();

      return (
        <div key={_id} className={styles.viewRow} style={{ marginBottom: '6px' }}>
          <div className={styles.textValue}>
            {index + 1} - {name}
          </div>
          {urlFile && (
            <div className={styles.viewRow}>
              <p
                onClick={() => this.handleOpenModalReview(urlFile)}
                className={styles.nameCertification}
              >
                {nameFile}
              </p>
              <img
                src="/assets/images/iconFilePNG.svg"
                alt="iconFilePNG"
                className={styles.iconCertification}
              />
            </div>
          )}
        </div>
      );
    });
  };

  render() {
    const { generalData } = this.props;
    const { visible, linkImage } = this.state;
    const {
      preJobTitle = '',
      skills = [],
      preCompany = '',
      // pastExp = 0,
      totalExp = 0,
      qualification = '',
      certification = [],
      otherSkills = [],
      linkedIn = '',
    } = generalData;
    // const objPreviousJobTilte = listTitle.find((item) => item._id === preJobTitle) || {};
    const items = [
      { id: 1, label: 'Previous Job Title', value: preJobTitle },
      { id: 2, label: 'Previous Company', value: preCompany },
      // { id: 3, label: 'Past Experience', value: pastExp },
      { id: 3, label: 'Total Experience (in years)', value: totalExp },
      { id: 4, label: 'Highest Qualification', value: qualification },
      { id: 5, label: 'LinkedIn', value: <span className={styles.linkedIn}>{linkedIn}</span> },
    ];

    const listColors = [
      {
        bg: '#E0F4F0',
        colorText: '#00c598',
      },
      {
        bg: '#ffefef',
        colorText: '#fd4546',
      },
      {
        bg: '#f1edff',
        colorText: '#6236ff',
      },
      {
        bg: '#f1f8ff',
        colorText: '#006bec',
      },
      {
        bg: '#fff7fa',
        colorText: '#ff6ca1',
      },
    ];
    // const listColors = ['red', 'purple', 'green', 'magenta', 'blue'];
    const formatListSkill = this.formatListSkill(skills, otherSkills, listColors) || [];
    return (
      <>
        <Row gutter={[0, 16]} className={styles.root}>
          {items.map((item) => (
            <Fragment key={item.id}>
              <Col span={6} className={styles.textLabel}>
                {item.label}
              </Col>
              <Col span={18} className={styles.textValue}>
                {item.value}
              </Col>
            </Fragment>
          ))}
          <Col span={6} className={styles.textLabel}>
            Certifications
          </Col>
          <Col span={18}>{this._renderListCertification(certification)}</Col>
          <Col span={6} className={styles.textLabel}>
            Skills
          </Col>
          <Col span={9} className={styles.tagSkill}>
            {formatListSkill.map((item) => (
              <Tag
                style={{
                  color: `${item.color.colorText}`,
                  fontWeight: 500,
                }}
                key={item.id}
                color={item.color.bg}
              >
                {item.name}
              </Tag>
            ))}
          </Col>
        </Row>
        <ViewDocumentModal visible={visible} onClose={this.handleCancel} url={linkImage} />
      </>
    );
  }
}

export default View;
