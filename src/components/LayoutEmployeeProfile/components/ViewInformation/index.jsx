import React, { PureComponent } from 'react';
import { Divider, Tag, Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import s from '@/components/LayoutEmployeeProfile/index.less';

const { Item } = Menu;

class ViewInformation extends PureComponent {
  render() {
    const listTagSkills = [
      { color: 'red', name: 'Product Management' },
      { color: 'volcano', name: 'UX Design' },
      { color: 'magenta', name: 'UI Design' },
      { color: 'orange', name: 'Product design' },
      { color: 'gold', name: 'Sales' },
    ];
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
    return (
      <div className={s.viewRight__infoEmployee}>
        <img
          src="/assets/images/img-cover.jpg"
          alt="img-cover"
          className={s.infoEmployee__imgCover}
        />
        <img
          src="https://st2.depositphotos.com/1007566/12304/v/950/depositphotos_123041444-stock-illustration-avatar-man-cartoon.jpg"
          alt="img-avt"
          className={s.infoEmployee__imgAvt}
        />
        {/* <div className={s.infoEmployee__imgAvt__upload}>btn upload</div> */}
        <div className={s.infoEmployee__textNameAndTitle}>
          <p className={s.infoEmployee__textNameAndTitle__name}>Aditya Venkatesh</p>
          <p className={s.infoEmployee__textNameAndTitle__title}>UX Lead, Designer</p>
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
            {listTagSkills.map((item) => (
              <Tag color={item.color}>{item.name}</Tag>
            ))}
          </div>
          <Divider />
          <div className={s.infoEmployee__viewBottom__row}>
            <p className={s.titleTag}>Joining Date</p>
            <p className={s.infoEmployee__textNameAndTitle__title}>16/02/2020</p>
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
      </div>
    );
  }
}

export default ViewInformation;
