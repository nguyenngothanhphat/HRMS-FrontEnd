import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        originalName: item.name,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData.map(item => check(item.authority, getSubMenu(item))).filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  routerMap.isEmpty = menuData.length < 1;
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    rightMenuData: [],
    locationMenuData: [],
    breadcrumbNameMap: { isEmpty: true },
  },

  effects: {
    *getMenuData({ payload }, { put, select }) {
      if (payload && payload.routes && payload.authority) {
        const { routes, authority } = payload;
        yield put({
          type: 'save',
          payload: { routes, authority },
        });
      }
      const currentState = yield select(state => state.menu);
      const { routes, authority } = currentState;
      if (!routes || !authority) return;
      let menuData = [];
      let rightMenuData = [];
      let locationMenuData = [];

      const pushMenu = {
        'right-menu': route => rightMenuData.push(route),
        'location-menu': route => locationMenuData.push(route),
        '': route => menuData.push(route),
      };

      routes.forEach(route => {
        const { position = '' } = route;
        pushMenu[position](route);
      });
      menuData = filterMenuData(memoizeOneFormatter(menuData, authority));
      rightMenuData = filterMenuData(memoizeOneFormatter(rightMenuData, authority));
      locationMenuData = filterMenuData(memoizeOneFormatter(locationMenuData, authority));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, rightMenuData, locationMenuData },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
