import { getMatchMenu, MenuDataItem } from '@umijs/route-utils';

// 获取当前的选中菜单
export const getSelectedMenuKeys = (pathname: string, menuData: MenuDataItem[]): string[] => {
  const splitPathName = pathname.split('/');
   const menus = getMatchMenu(
     splitPathName.length > 1 ? `/${splitPathName[1]}` : pathname,
     menuData,
   );
   return menus.map((item) => item.key || item.path || '');
};
