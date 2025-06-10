import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Avatar } from '@heroui/avatar';
import {
  TbX,
} from 'react-icons/tb';
import AppToggler from './AppToggler';
import { useAppLayout } from './AppLayoutContext';


type Props = {
  children: React.ReactNode;
  sideNavContent: React.ReactNode;

}

export default function AppLayout({ children, sideNavContent }: Props) {
  const { sidebarCollapsed, mobileMenuOpen, toggleMobileMenu } = useAppLayout();

  return (
    <div className="h-screen bg-background flex overflow-hidden select-none">
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen border-r border-divider transition-all duration-300 ease-in-out z-50 bg-content1
          ${sidebarCollapsed ? 'lg:w-12' : 'lg:w-80'} w-80
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-full">
          <AppToggler />
          <div className={`
            flex-1 flex-col transition-all duration-300
            ${sidebarCollapsed ? 'lg:hidden' : 'flex'}
            ${mobileMenuOpen ? 'flex' : 'hidden lg:flex'}
          `}>
            <div className="flex items-center gap-3 p-4 h-12 border-b border-divider">
              <Avatar
                size="sm"
                className="bg-gradient-to-br from-primary to-secondary text-white font-semibold shadow-lg"
                name="WS"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-foreground truncate">My Workspace</span>
                <span className="text-xs text-default-500 truncate">Team Project</span>
              </div>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="lg:hidden"
                onPress={toggleMobileMenu}
              >
                <TbX className="text-xl" />
              </Button>
            </div>

            <nav className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
              {sideNavContent}
            </nav>

            <div className=" border-t border-divider">
              <div className="flex items-center gap-3 p-3 bg-content2/50 rounded-xl">
                <div className="relative">
                  <Avatar
                    size="sm"
                    className="bg-gradient-to-br from-success to-warning text-white font-semibold"
                    name="JD"
                  />
                  <Chip
                    size="sm"
                    color="success"
                    className="absolute -bottom-1 -right-1 min-w-3 h-3 p-0"
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold text-foreground truncate">John Doe</span>
                  <span className="text-xs text-default-500 truncate">john@example.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {children}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}
    </div>
  );
}