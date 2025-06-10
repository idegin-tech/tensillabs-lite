import EachNavLink from "@/components/layouts/app-layouts/EachNavLink";
import useCommon from "@/hooks/useCommon";
import { TbBell, TbBellFilled, TbClock, TbClockFilled, TbHome, TbHomeFilled } from "react-icons/tb";
import { useLocation } from "react-router-dom";


export default function TasksAppNav() {
    const { getPathToApp } = useCommon();
    const pathname = useLocation().pathname;

    return (
        <>
            <EachNavLink
                activeIcon={<TbHomeFilled />}
                icon={<TbHome />}
                href={getPathToApp('tasks')}
                label="Home"
                isActiveRoute={pathname === getPathToApp('tasks')}
            />
            <EachNavLink
                activeIcon={<TbBellFilled />}
                icon={<TbBell />}
                href={getPathToApp('tasks') + '/notifications'}
                label="Notifications"
                isActiveRoute={pathname.includes(getPathToApp('tasks') + '/notifications')}
            />
            <EachNavLink
                activeIcon={<TbClockFilled />}
                icon={<TbClock />}
                href={getPathToApp('tasks') + '/timesheet'}
                label="Time sheet"
                isActiveRoute={pathname.includes(getPathToApp('tasks') + '/timesheet')}
            />
        </>
    )
}
