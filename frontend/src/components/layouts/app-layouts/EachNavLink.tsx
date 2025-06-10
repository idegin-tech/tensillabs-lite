import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Link } from 'react-router-dom';

type Props = {
    to: string;
    item: any;
    isActiveRoute: (href: string) => boolean;
}

export default function EachNavLink({ item, to, isActiveRoute }: Props) {
    return (
        <>
            <Link
                to={to}>
                <div className="relative">
                    {item.hasNotification ? (
                        <div className="relative">
                            <Button
                                variant={isActiveRoute(to) ? "flat" : "bordered"}
                                className={`
                            w-full justify-start gap-3 p-2 h-auto transition-all duration-200
                            ${isActiveRoute(to)
                                        ? 'bg-primary/20 text-primary border border-primary/30 p-1.5'
                                        : 'text-default-600 hover:text-primary hover:bg-primary/10'
                                    }
                            `}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            </Button>
                            <Chip
                                size='sm'
                                color="primary"
                                className="absolute top-3 right-2 p-0 h-3 min-w-3"
                            />
                        </div>
                    ) : (
                        <Button
                            variant={isActiveRoute(to) ? "flat" : "light"}
                            className={`
                          w-full justify-start gap-3 p-2 h-auto transition-all duration-200
                          ${isActiveRoute(to)
                                    ? 'bg-primary/20 text-primary border border-primary/30'
                                    : 'text-default-600 hover:text-primary hover:bg-primary/10'
                                }
                        `}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </div>
                        </Button>
                    )}
                </div>
            </Link>
        </>
    )
}