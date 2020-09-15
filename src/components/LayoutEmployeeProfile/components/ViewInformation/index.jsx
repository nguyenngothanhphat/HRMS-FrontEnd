import React, { PureComponent } from 'react';
import { Divider, Tag, Menu, Dropdown, Button, Spin } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import ModalUpload from '@/components/ModalUpload';
import s from '@/components/LayoutEmployeeProfile/index.less';

const { Item } = Menu;

@connect(({ loading, employeeProfile: { generalData = {}, compensationData = {} } = {} }) => ({
  generalData,
  compensationData,
  loading: loading.effects['employeeProfile/fetchGeneralInfo'],
}))
class ViewInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openModalUpload = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  formatListSkill = (skills, colors) => {
    let temp = 0;
    const listFormat = skills.map((item) => {
      if (temp >= 5) {
        temp -= 5;
      }
      temp += 1;
      return {
        color: colors[temp - 1],
        name: item,
      };
    });
    return listFormat;
  };

  render() {
    const dummyListSkill = [
      'Product Management',
      'UX Design',
      'UI Design',
      'Product design',
      'Sales',
    ];
    const { generalData, compensationData, loading } = this.props;
    const { firstName = '', avatar = '', skillss = dummyListSkill, createdAt = '' } = generalData;
    const { tittle: { name: title = '' } = {} } = compensationData;
    const { visible } = this.state;
    const joinningDate = moment(createdAt).format('DD/MM/YYYY');
    const listColors = ['red', 'purple', 'green', 'magenta', 'blue'];
    const formatListSkill = this.formatListSkill(skillss, listColors) || [];
    const menu = (
      <Menu>
        <Item key="1" onClick={() => alert(1)}>
          <div className={s.itemDropdownMenu}>Edit bio</div>
        </Item>
        <Item key="2" onClick={() => alert(2)}>
          <div className={s.itemDropdownMenu}>Put on Leave (PWP)</div>
        </Item>
        <Item key="3" onClick={() => alert(3)}>
          <div className={s.itemDropdownMenu}>Raise Termination</div>
        </Item>
        <Item key="4" onClick={() => alert(4)}>
          <div className={s.itemDropdownMenu}>Request Details</div>
        </Item>
      </Menu>
    );
    if (loading)
      return (
        <div className={s.viewLoading}>
          <Spin />
        </div>
      );
    return (
      <div className={s.viewRight__infoEmployee}>
        <img
          src="/assets/images/img-cover.jpg"
          alt="img-cover"
          className={s.infoEmployee__imgCover}
        />
        <img src={avatar} alt="img-avt" className={s.infoEmployee__imgAvt} />
        <img
          src="/assets/images/iconUploadImage.svg"
          onClick={this.openModalUpload}
          alt="img-upload"
          className={s.infoEmployee__imgAvt__upload}
        />
        <div className={s.infoEmployee__textNameAndTitle}>
          <p className={s.infoEmployee__textNameAndTitle__name}>{firstName}</p>
          <p className={s.infoEmployee__textNameAndTitle__title}>{title}</p>
        </div>
        <div className={s.infoEmployee__viewBottom}>
          <p className={s.infoEmployee__viewBottom__description}>
            With his friendly smile and a simple `hi`, Adi is someone you can`t easily fail to
            notice. His energy is contagious and can make the conversation take a super interesting
            turn!
          </p>
          <Divider />
          <p className={s.titleTag}>Skills</p>
          <div>
            {formatListSkill.map((item) => (
              <Tag color={item.color}>{item.name}</Tag>
            ))}
          </div>
          <Divider />
          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag}>Joining Date</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>{joinningDate}</p>
          </div>
          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag}>Location</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>Bengaluru, India</p>
          </div>
          <div>
            <img src="/assets/images/iconLinkedin.svg" alt="img-arrow" />
            <img src="/assets/images/iconMail.svg" alt="img-arrow" style={{ marginLeft: '5px' }} />
          </div>
        </div>
        <div className={s.viewBtnAction}>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button type="primary" className={s.btnAction}>
              <span className={s.btnAction__text}>Action</span>
              <img
                src="/assets/images/iconDownButton.svg"
                alt="img-arrow"
                style={{ marginLeft: '5px' }}
              />
            </Button>
          </Dropdown>
        </div>
        <ModalUpload visible={visible} handleCancel={this.handleCancel} />
      </div>
    );
  }
}

export default ViewInformation;
