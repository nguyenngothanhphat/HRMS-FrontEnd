import { QuestionCircleOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import FAQIcon from '@/assets/dashboard/faq.svg';
import PoliciesIcon from '@/assets/dashboard/policies.svg';
import QuickLinkIcon from '@/assets/dashboard/quickLink.svg';
import RaiseTicketIcon from '@/assets/dashboard/raiseTicket.svg';
import CommonModal from '@/components/CommonModal';
import QuickLinks from '@/components/QuickLinks';
import RaiseTicketModal from '@/components/RaiseTicketModal';
import { isOwner } from '@/utils/authority';
import styles from '../../../../index.less';
import HeaderDropdown from '../Dropdown';

@connect(() => ({}))
class MenuDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      QUICK_LINKS: 'QUICK_LINKS',
      FAQ: 'FAQ',
      RAISE_TICKET: 'RAISE_TICKET',
      POLICIES_REGULATION: 'POLICIES_REGULATION',
      quickLinkModalVisible: false,
      raiseTicketModalVisible: false,
    };
  }

  onToggleQuickLinkModal = () => {
    this.setState(({ quickLinkModalVisible }) => ({
      quickLinkModalVisible: !quickLinkModalVisible,
    }));
  };

  onToggleRaiseTicketModal = () => {
    this.setState(({ raiseTicketModalVisible }) => ({
      raiseTicketModalVisible: !raiseTicketModalVisible,
    }));
  };

  onMenuClick = async (event) => {
    const { key } = event;
    const { QUICK_LINKS, FAQ, RAISE_TICKET, POLICIES_REGULATION } = this.state;
    if (key === QUICK_LINKS) {
      this.onToggleQuickLinkModal();
    }
    if (key === FAQ) {
      history.push('/faq');
    }
    if (key === RAISE_TICKET) {
      this.onToggleRaiseTicketModal();
    }
    if (key === POLICIES_REGULATION) {
      history.push('/policies-regulations');
    }
  };

  render() {
    const {
      QUICK_LINKS,
      FAQ,
      RAISE_TICKET,
      POLICIES_REGULATION,
      quickLinkModalVisible,
      raiseTicketModalVisible,
    } = this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key={QUICK_LINKS} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIcon}>
            <img src={QuickLinkIcon} alt="" />
            <span>Quick Links</span>
          </div>
        </Menu.Item>
        {/* <Menu.Divider className={styles.secondDivider} /> */}
        {!isOwner() && (
          <Menu.Item key={RAISE_TICKET} className={styles.menuItemLink}>
            <div className={styles.menuItemLink__withIcon}>
              <img src={RaiseTicketIcon} alt="" />
              <span>Raise Ticket</span>
            </div>
          </Menu.Item>
        )}
        {/* <Menu.Divider className={styles.secondDivider} /> */}
        <Menu.Item key={FAQ} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIcon}>
            <img src={FAQIcon} alt="" />
            <span>FAQ</span>
          </div>
        </Menu.Item>
        <Menu.Item key={POLICIES_REGULATION} className={styles.menuItemLink}>
          <div className={styles.menuItemLink__withIcon}>
            <img src={PoliciesIcon} alt="PoliciesIcon" />
            <span>Policies & Regulations</span>
          </div>
        </Menu.Item>
        {/* <Menu.Divider className={styles.secondDivider} /> */}
      </Menu>
    );
    return (
      <>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <div className={`${styles.action} ${styles.notify}`}>
            <QuestionCircleOutlined />
          </div>
        </HeaderDropdown>
        <CommonModal
          visible={quickLinkModalVisible}
          title="Quick Links"
          onClose={this.onToggleQuickLinkModal}
          hasFooter={false}
          content={<QuickLinks />}
          withPadding
          width={500}
        />
        {!isOwner() && (
          <RaiseTicketModal
            visible={raiseTicketModalVisible}
            title="Raise Ticket"
            onClose={this.onToggleRaiseTicketModal}
          />
        )}
      </>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(MenuDropdown);
