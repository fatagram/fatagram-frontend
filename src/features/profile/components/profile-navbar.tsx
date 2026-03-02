import { Button, Text } from "@/components/atoms";
import Dropdown from "@/components/atoms/dropdown";
import { NavbarItem } from "@/components/organisms/navigation/navbar";
import { useSize } from "@/hooks/use-size";
import { debounce } from "@/utils/debounce";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useProfilePage } from "../hooks/use-profile-page";

interface ProfileNavbarProps {
  className?: string;
}

type NavbarItem = {
  name: string;
  href?: string;
  isOwnerOnly?: boolean;
  isIndex?: boolean;
};

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({ className = "" }) => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const navigate = useNavigate();
  const location = useLocation();
  const { userParam, isOwner } = useProfilePage();

  const [containerRef, containerSize] = useSize<HTMLDivElement>();
  const showMoreRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<NavbarItem[]>([]);
  const [hiddenItems, setHiddenItems] = useState<NavbarItem[]>([]);
  const [isChooseHiddenItem, setIsChooseHiddenItem] = useState<boolean>(false);

  const navbarItems = useMemo(
    () => [
      {
        name: t("user:profileMenu.posts"),
        href: `/${userParam}`,
        isOwnerOnly: false,
        isIndex: true,
      },
      {
        name: t("user:profileMenu.friends"),
        href: `/${userParam}/friends`,
        isOwnerOnly: false,
        isIndex: false,
      },
      {
        name: t("user:profileMenu.photos"),
        href: `/${userParam}/photos`,
        isOwnerOnly: false,
        isIndex: false,
      },
      {
        name: t("user:profileMenu.videos"),
        href: `/${userParam}/videos`,
        isOwnerOnly: false,
        isIndex: false,
      },
      {
        name: t("user:profileMenu.about"),
        href: `/${userParam}/about`,
        isOwnerOnly: false,
        isIndex: false,
      },
      {
        name: t("user:profileMenu.settings"),
        href: `/${userParam}/settings`,
        isOwnerOnly: true,
        isIndex: false,
      },
    ],
    [userParam, t],
  );

  useEffect(() => {
    // Don't early return - let effect run but handle logic inside
    const handleResize = () => {
      if (containerSize.width === 0) return; // Check inside function instead

      let total = showMoreRef.current?.offsetWidth ?? 0;
      const newVisibleItems: NavbarItem[] = [];
      const newHiddenItems: NavbarItem[] = [];

      navbarItems.forEach((item, index) => {
        if (item.isOwnerOnly && !isOwner) return;
        const itemWidth = itemRefs.current[index]?.offsetWidth ?? 0;
        if (total + itemWidth < containerSize.width + 32) {
          newVisibleItems.push(item);
          total += itemWidth;
        } else {
          newHiddenItems.push(item);
        }
      });

      // console.log(total, containerSize.width);

      setVisibleItems(newVisibleItems);
      setHiddenItems(newHiddenItems);
    };

    const debouncedHandle = debounce(handleResize, 20); // 50ms delay
    debouncedHandle(); // chạy ngay lần đầu
  }, [containerSize.width, isOwner, navbarItems]); // Remove hiddenItems.length to prevent infinite loop

  useEffect(() => {
    const currentPath = location.pathname;
    const foundInHidden = hiddenItems.some((item) => item.href === currentPath);
    setIsChooseHiddenItem(foundInHidden);
  }, [location.pathname, hiddenItems]);

  return (
    <div className={clsx("relative flex py-2", className)} ref={containerRef}>
      <div className="absolute invisible">
        {navbarItems.map((item, index) => {
          if (item.isOwnerOnly && !isOwner) return null;
          return (
            <div
              key={index}
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
            >
              <NavbarItem
                path={item.href ?? ""}
                children={item.name}
                onClick={() => setShowDropdown(false)}
                activeRoute={item.isIndex ?? true}
              />
            </div>
          );
        })}
      </div>
      <div className="flex">
        {visibleItems.map((item) => (
          <NavbarItem
            key={item.name}
            path={item.href ?? ""}
            children={item.name}
            onClick={() => setShowDropdown(false)}
            activeRoute={item.isIndex ?? true}
          />
        ))}
      </div>
      {hiddenItems.length > 0 && (
        <Button
          variant="secondary"
          className={clsx("relative bg-transparent hover:bg-[var(--main-bg-color)]")}
          onClick={() => setShowDropdown(!showDropdown)}
          ref={showMoreRef}
        >
          <Text
            className={clsx(
              "whitespace-nowrap",
              isChooseHiddenItem ? "!text-single-main" : "text-[var(--text-color)]",
            )}
          >
            More <i className="fa-solid fa-caret-down ml-1"></i>
          </Text>
          {isChooseHiddenItem && (
            <div
              className={clsx(
                "absolute bg-primary-500 h-[2px] rounded-full",
                "w-full bottom-0 left-0",
              )}
            />
          )}
        </Button>
      )}
      {showDropdown && (
        <Dropdown
          className={clsx(
            "absolute z-[9999] top-[100%] m-0 bg-bg-second",
            "shadow-lg rounded-md w-[95%] -translate-x-1/2 left-1/2 p-2",
          )}
          showPolygon={false}
          isShow={showDropdown}
          items={hiddenItems.map((item) => ({
            id: item.name,
            content: (
              <div
                className={clsx(
                  "flex justify-between items-center",
                  location.pathname === item.href ? "text-single-main" : "text-[var(--text-color)]",
                )}
              >
                {item.name}
                {location.pathname === item.href && <i className="fas fa-check"></i>}
              </div>
            ),
            onClick: () => {
              navigate(item.href ?? "/");
              setShowDropdown(false);
            },
          }))}
        />
      )}
    </div>
  );
};

export default ProfileNavbar;
