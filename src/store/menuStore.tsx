import {create} from "zustand";
import {MenuProps} from "antd";
import {RouterType} from "@/store/routerStore.tsx";
import {createIcon} from "@/utils/componentLoad.tsx";


type MenuItem = Required<MenuProps>['items'][number];

interface MenuStore {
    menuItem: MenuItem[];
    selectedItem: string[];
    openKeys: string[];
    setMenuItem: (menuItem: MenuItem[]) => void;
    setSelectedItem: (selectedItem: string[]) => void;
    setOpenKeys: (openKeys: string[]) => void;
}

// format the menu 将路由转换为菜单项
export function formatMenu(menu: RouterType[]): MenuItem[] {
    const menuItems: MenuItem[] = [];
    menu.forEach((item) => {
        // 将路由转换为菜单项 只有layout下的路由才会显示在菜单中 并且如果有子路由的话 会显示在子菜单中
        if (item.path === '/layout') {
            item.children?.forEach((child) => {
                if (child.index) {
                    menuItems.push({
                        key: child.path,
                        label: child.label,
                        icon: createIcon(child.icon),
                    });
                } else {
                    menuItems.push({
                        key: child.path,
                        label: child.label,
                        icon: createIcon(child.icon),
                        children: child.children?.map((subChild) => ({
                            key: subChild.path,
                            label: subChild.label,
                            icon: createIcon(subChild.icon),
                        })),
                    });
                }
            });
        }
    });
    return menuItems;
}

/**
 * Store for the menu items
 * @param set - set the menu items
 * @returns
 * @constructor
 */
export const useMenuStore = create<MenuStore>((set) => ({
    menuItem: [],
    setMenuItem: (menuItem: MenuItem[]) => set({menuItem}),
    selectedItem: ['dashboard'],
    setSelectedItem: (selectedItem: string[]) => set({selectedItem}),
    openKeys: [],
    setOpenKeys: (openKeys: string[]) => set({openKeys}),
}));


export default useMenuStore;