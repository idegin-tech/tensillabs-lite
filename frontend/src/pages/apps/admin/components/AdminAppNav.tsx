import EachNavLink from "@/components/layouts/app-layouts/EachNavLink";
import useCommon from "@/hooks/useCommon";
import { TbChartDonut4, TbChartDonutFilled, TbUser, TbUserFilled, TbWallet } from "react-icons/tb";
import { useLocation } from "react-router-dom";


export default function AdminAppNav() {
    const { getPathToApp } = useCommon();
    const pathname = useLocation().pathname;

    return (
        <>
            <EachNavLink
                isActiveRoute={pathname === getPathToApp('admin')}
                icon={<TbChartDonut4 />}
                activeIcon={<TbChartDonutFilled />}
                label="Overview"
                href={getPathToApp('admin')}
            />
            <EachNavLink
                isActiveRoute={pathname.includes(getPathToApp('admin') + '/users')}
                icon={<TbUser />}
                activeIcon={<TbUserFilled />}
                label="Users"
                href={getPathToApp('admin') + '/users'}
            />
            <EachNavLink
                isActiveRoute={pathname.includes(getPathToApp('admin') + '/billing')}
                icon={<TbWallet />}
                activeIcon={<TbWallet />}
                label="Billing"
                href={getPathToApp('admin') + '/billing'}
            />
        </>
    )
}
