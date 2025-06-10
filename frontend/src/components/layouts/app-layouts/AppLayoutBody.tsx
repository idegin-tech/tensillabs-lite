import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import {
    TbMenu2,
    TbSearch,
    TbChevronLeft,
    TbChevronRight,
    TbHelpCircle,
} from 'react-icons/tb';
import { useAppLayout } from './AppLayoutContext';

export default function AppLayoutBody({ children }: { children: React.ReactNode }) {
    const { toggleSidebar, toggleMobileMenu } = useAppLayout();

    return (
        <>
            <div className="flex flex-col flex-1 min-w-0">
                <header className="h-16 border-b border-divider flex items-center justify-between px-6 bg-content1/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onPress={toggleSidebar}
                            className="hidden lg:flex hover:bg-content2 transition-colors"
                        >
                            <TbMenu2 className="text-xl" />
                        </Button>
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onPress={toggleMobileMenu}
                            className="lg:hidden hover:bg-content2 transition-colors"
                        >
                            <TbMenu2 className="text-xl" />
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                className="hover:bg-content2 transition-colors"
                            >
                                <TbChevronLeft className="text-lg" />
                            </Button>
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                className="hover:bg-content2 transition-colors"
                            >
                                <TbChevronRight className="text-lg" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 max-w-2xl mx-8">
                        <Input
                            classNames={{
                                base: "w-full",
                                mainWrapper: "h-full",
                                input: "text-sm",
                                inputWrapper: "h-10 min-h-10 bg-content1 border border-divider hover:border-primary focus-within:!border-primary transition-colors shadow-sm",
                            }}
                            placeholder="Search workspace..."
                            size="sm"
                            startContent={
                                <TbSearch className="w-4 h-4 text-default-400 pointer-events-none" />
                            }
                            type="search"
                            variant="bordered"
                        />
                    </div>

                    <div className="flex items-center">
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="hover:bg-content2 transition-colors"
                        >
                            <TbHelpCircle className="text-xl" />
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-background">
                    <div className="p-6 max-w-full">
                        {children}
                    </div>
                </main>
            </div>
        </>
    )
}