import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    label: string;
    href: string;
    hasNotification?: boolean;
    isActiveRoute?: boolean;
}

export default function EachNavLink({ isActiveRoute, href, icon, label, hasNotification, activeIcon }: Props) {
    const navigate = useNavigate();

    return (
        <>
            <div className="relative">
                <div className="relative">
                    <Button
                        onClick={() => navigate(href)}
                        variant={isActiveRoute ? "flat" : "bordered"}
                        className={`
                            w-full justify-start gap-3 p-2 h-auto transition-all duration-200
                            ${isActiveRoute
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'text-default-600 hover:text-foreground hover:bg-content2 border border-transparent'
                            }
                            `}
                    >
                        <div className="flex items-center gap-2 flex-1">
                            <span className='text-lg'>{isActiveRoute ? activeIcon : icon}</span>
                            <span className="font-medium">{label}</span>
                        </div>
                    </Button>
                    {hasNotification && <Chip
                        size='sm'
                        color="primary"
                        className="absolute top-4 right-3 p-0 h-2 min-w-2"
                    />}
                </div>
            </div>
        </>
    )
}