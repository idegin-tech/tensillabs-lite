import { Button } from '@heroui/button';
import { Badge } from '@heroui/badge';
import { Tooltip } from '@heroui/tooltip';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { TbHome } from 'react-icons/tb';
import {
    PiCheckCircleDuotone,
    PiGearDuotone,
    PiFolderDuotone,
    PiChatCircleDuotone,
    PiSparkleDuotone
} from "react-icons/pi";

interface AppItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    hasNotification?: boolean;
}

export default function AppToggler() {
    const { member_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const iconSize = 19;

    const appItems: AppItem[] = [
        {
            icon: <PiCheckCircleDuotone size={iconSize} />,
            label: 'Tasks',
            href: `/workspaces/${member_id}/apps/tasks`,
            hasNotification: true
        },
        {
            icon: <PiGearDuotone size={iconSize} />,
            label: 'Admin',
            href: `/workspaces/${member_id}/apps/admin`,
        },
        {
            icon: <PiSparkleDuotone size={iconSize} />,
            label: 'AI',
            href: `/workspaces/${member_id}/apps/brain`,
            hasNotification: true
        },
        {
            icon: <PiFolderDuotone size={iconSize} />,
            label: 'Files',
            href: `/workspaces/${member_id}/apps/files`,
        },
        {
            icon: <PiChatCircleDuotone size={iconSize} />,
            label: 'Chat',
            href: `/workspaces/${member_id}/apps/chat`,
            hasNotification: true
        }
    ];

    const isActiveApp = (href: string) => {
        return location.pathname.includes(href);
    };

    return (
        <div className="min-w-12 w-12 border-r border-divider h-full pb-4 flex flex-col items-center bg-content2/50 z-50">            <div className="mb-2 h-12 flex items-center justify-center border-b border-divider w-full">
            <Tooltip content="Home" placement="right">
                <Button
                    onPress={() => navigate('/')}
                    size='sm'
                    isIconOnly
                    variant="bordered"
                    className="border-divider text-default-600 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                    <TbHome size={iconSize} />
                </Button>
            </Tooltip>
        </div>

            <div className="flex flex-col gap-3">
                {appItems.map((app, index) => (
                    <Tooltip
                        key={index}
                        content={app.label}
                        placement="right"
                    >
                        <div className="relative">
                            <Badge
                                content=""
                                color="danger"
                                size="sm"
                                placement="top-right"
                                className="z-10"
                                isInvisible={app.hasNotification}
                            >
                                <Button
                                    onPress={() => navigate(app.href)}
                                    size='sm'
                                    isIconOnly
                                    variant={isActiveApp(app.href) ? "flat" : "bordered"}
                                    className={`
                                            relative group transition-all duration-200  border-divider
                                            ${isActiveApp(app.href)
                                            ? 'bg-primary/20 text-primary border-2 border-primary/30 shadow-lg'
                                            : 'text-default-600 hover:text-primary hover:bg-primary/10 hover:scale-105'
                                        }
                                    `}
                                >
                                    {app.icon}
                                </Button>
                            </Badge>
                        </div>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
