import React, { useState } from 'react';
import styles from './index.less';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import QuickLinksIcon from './assets/quicklinks.svg';

const ViewRightQuicklLink = () => {
  const [viewDocumentModal, setViewDocumentModal] = useState(false);
  const link =
    'https://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf';

  return (
    <div className={styles.ViewRightQuicklLink}>
      <div className={styles.containerTitle}>
        <img src={QuickLinksIcon} alt="" />
        <div className={styles.title}>Quick Links</div>
      </div>
      <div className={styles.link} onClick={() => setViewDocumentModal(true)}>
        Offboarding policy
      </div>
      <ViewDocumentModal
        url={link}
        visible={viewDocumentModal}
        onClose={() => setViewDocumentModal(false)}
      />
    </div>
  );
};

export default ViewRightQuicklLink;
