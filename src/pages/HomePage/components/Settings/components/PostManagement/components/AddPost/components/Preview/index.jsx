import React, { useState, useEffect } from 'react';
import Parser from 'html-react-parser';
import styles from './index.less';
import { TAB_IDS } from '@/utils/homePage';
import EmployeeTag from '@/pages/HomePage/components/Announcements/components/EmployeeTag';
import PostContent from '@/pages/HomePage/components/Announcements/components/PostContent';
import PreviewImage from '@/assets/homePage/previewImage.png';
import CelebratingCard from '@/pages/HomePage/components/Celebrating/components/Card';
import GalleryCard from '@/pages/HomePage/components/Gallery/components/Card';
import Carousel from '@/pages/HomePage/components/Carousel';
import Options from '@/pages/HomePage/components/Voting/components/Options';

const Preview = (props) => {
  const {
    mode = '',
    editing = false,
    formValues: {
      uploadFilesA = [],
      descriptionA = '',
      uploadFilesB = [],
      descriptionB = '',
      uploadFilesBN = [],
      titleI = '',
      uploadFilesI = [],
      descriptionI = '',
      questionP = '',
      responsesP = [],
      startDateP = '',
      endDateP = '',
    },
    owner = {},
  } = props;

  const [announcementContent, setAnnouncementContent] = useState({
    imageUrls: [],
  });
  const [birthdayContent, setBirthdayContent] = useState({
    imageUrls: [],
  });
  const [imagesContent, setImagesContent] = useState({
    imageUrls: [],
  });
  const [bannerContent, setBannerContent] = useState({
    imageUrls: [],
  });

  const toBase64 = (file) =>
    // eslint-disable-next-line compat/compat
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const getBase64Arr = (arr, func) => {
    // eslint-disable-next-line compat/compat
    Promise.all(
      arr.map((x) => {
        if (x.url) return x.url;
        return toBase64(x.originFileObj);
      }),
    ).then((data) => {
      func({ imageUrls: data });
    });
  };

  useEffect(() => {
    if (editing && Array.isArray(uploadFilesA)) {
      getBase64Arr(uploadFilesA, setAnnouncementContent);
    } else if (uploadFilesA?.fileList && uploadFilesA.fileList.length > 0) {
      getBase64Arr(uploadFilesA.fileList, setAnnouncementContent);
    } else {
      setAnnouncementContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesA)]);

  useEffect(() => {
    if (editing && Array.isArray(uploadFilesB)) {
      getBase64Arr(uploadFilesB, setBirthdayContent);
    } else if (uploadFilesB?.fileList && uploadFilesB.fileList.length > 0) {
      getBase64Arr(uploadFilesB.fileList, setBirthdayContent);
    } else {
      setBirthdayContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesB)]);

  useEffect(() => {
    if (editing && Array.isArray(uploadFilesI)) {
      getBase64Arr(uploadFilesI, setImagesContent);
    } else if (uploadFilesI?.fileList && uploadFilesI.fileList.length > 0) {
      getBase64Arr(uploadFilesI.fileList, setImagesContent);
    } else {
      setImagesContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesI)]);

  useEffect(() => {
    if (editing && Array.isArray(uploadFilesBN)) {
      getBase64Arr(uploadFilesBN, setBannerContent);
    } else if (uploadFilesBN?.fileList && uploadFilesBN.fileList.length > 0) {
      getBase64Arr(uploadFilesBN.fileList, setBannerContent);
    } else {
      setBannerContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesBN)]);

  const renderPreview = () => {
    const post = {
      id: 1,
      employee: {
        generalInfoInfo: {
          legalName: owner?.generalInfo?.legalName,
          avatar: owner?.generalInfo?.avatar,
        },
        titleInfo: {
          name: owner?.titleInfo?.name,
        },
      },
      attachments:
        announcementContent.imageUrls.length > 0
          ? announcementContent.imageUrls.map((x) => {
              return { url: x };
            })
          : [
              {
                url: PreviewImage,
              },
            ],
      description: descriptionA || 'Description',
    };

    switch (mode) {
      case TAB_IDS.ANNOUNCEMENTS:
        return (
          <>
            <EmployeeTag employee={post.employee} />
            <PostContent post={post} />
          </>
        );
      case TAB_IDS.ANNIVERSARY:
        return (
          <div style={{ padding: '24px' }}>
            <CelebratingCard
              previewing
              contentPreview={{
                previewImage:
                  birthdayContent.imageUrls.length > 0 ? birthdayContent.imageUrls[0] : '',
                previewDescription: descriptionB ? Parser(descriptionB) : 'Description',
              }}
            />
          </div>
        );
      case TAB_IDS.IMAGES:
        return (
          <div style={{ padding: '24px' }}>
            <GalleryCard
              previewing
              contentPreview={
                imagesContent.imageUrls.length > 0
                  ? [
                      {
                        attachments: [{ url: imagesContent.imageUrls[0] }],
                        description: descriptionI ? Parser(descriptionI) : '',
                        title: titleI || '',
                      },
                    ]
                  : [
                      {
                        description: descriptionI ? Parser(descriptionI) : 'Description',
                        title: titleI || 'Title',
                      },
                    ]
              }
            />
          </div>
        );
      case TAB_IDS.BANNER:
        return <Carousel previewing contentPreview={bannerContent.imageUrls} />;

      case TAB_IDS.POLL:
        return (
          <div style={{ padding: '24px' }}>
            <Options
              previewing
              contentPreview={{
                previewQuestion: questionP || 'Question',
                previewStartDate: startDateP,
                previewEndDate: endDateP,
                previewOptions: responsesP,
              }}
            />
          </div>
        );

      default:
        return '';
    }
  };

  return <div className={styles.Preview}>{renderPreview()}</div>;
};

export default Preview;
