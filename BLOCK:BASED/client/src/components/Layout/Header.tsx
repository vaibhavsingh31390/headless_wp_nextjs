import { getRelativePath, processJsonForMenu } from "@/utils/helpers";
import { MainMenu } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import Container from "../Function/Container";
import Column from "../Function/Column";

function Header({ menuData }: { menuData: MainMenu }) {
  const menu_items = processJsonForMenu(menuData);
  return (
    <header className="w-full z-[9999] sticky top-0 left-0 bg-slate-800 backdrop-blur-md text-white">
      <Container>
        <Column
          width="100%"
          className="flex justify-between items-center h-[64px]"
        >
          <Link href="/" aria-label="Home">
            <Image
              src="/logo.svg"
              alt="Company Logo"
              height={100}
              width={100}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="h-full flex justify-end items-center"
          >
            <ul className="flex items-center h-full">
              {menu_items.length > 0 &&
                menu_items.map((item) => (
                  <li key={item.id} className="h-full relative group">
                    <Link
                      href={getRelativePath(item.destination)}
                      className="text-with-transition-1 flex items-center h-full px-7"
                    >
                      {item.label}
                    </Link>
                    {item.subMenuItems.length > 0 && (
                      <div className="group-hover:block hidden bg-slate-800 backdrop-blur-md text-right absolute right-0 top-full">
                        <ul>
                          {item.subMenuItems.map((subMenu) => (
                            <li
                              key={subMenu.id}
                              className="h-full relative group"
                            >
                              <Link
                                href={getRelativePath(subMenu.destination)}
                                className="text-with-transition-1 whitespace-nowrap flex items-center h-full px-7 py-3"
                              >
                                {subMenu.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
            {menuData.main_menu?.callToActionButton && (
              <Link
                href={getRelativePath(
                  menuData.main_menu.callToActionButton.destination.link
                )}
                className="ml-3 mt-auto mb-auto inline-block px-4 py-2 uppercase rounded-md font-bold button-with-transition-2"
              >
                {menuData.main_menu.callToActionButton.label}
              </Link>
            )}
          </nav>
        </Column>
      </Container>
    </header>
  );
}

export default Header;
