import { Button, Text } from "@/components/atoms";
import Dropdown from "@/components/atoms/dropdown";
import { NavbarItem } from "@/components/ui/navigation/navbar";
import { useSize } from "@/hooks/use-size";
import { debounce } from "@/utils/debounce";
import clsx from "clsx";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
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
  const showMoreMeasureRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const allItemsWidth = useRef<number>(0);

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

      if (allItemsWidth.current === 0) {
        allItemsWidth.current = navbarItems.reduce((total, item, index) => {
          if (item.isOwnerOnly && !isOwner) return total;
          const itemWidth = itemRefs.current[index]?.offsetWidth;
          return total + itemWidth;
        }, 0);
      }

      let total = 0;
      const newVisibleItems: NavbarItem[] = [];
      const newHiddenItems: NavbarItem[] = [];

      if (allItemsWidth.current > containerSize.width) {
        total += showMoreMeasureRef.current?.offsetWidth ?? 0;
      }

      navbarItems.forEach((item, index) => {
        if (item.isOwnerOnly && !isOwner) return;
        const itemWidth = itemRefs.current[index]?.offsetWidth ?? 0;
        if (total + itemWidth < containerSize.width) {
          newVisibleItems.push(item);
          total += itemWidth;
        } else {
          newHiddenItems.push(item);
        }
      });

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

  const ShowMoreButton: React.FC<{ ref: RefObject<HTMLButtonElement | null> }> = ({ ref }) => {
    return (
      <Button
        variant="secondary"
        className={clsx("relative bg-transparent hover:bg-[var(--main-bg-color)]")}
        onClick={() => setShowDropdown(!showDropdown)}
        ref={ref}
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
    );
  };

  return (
    <div className={clsx("relative flex py-2", className)} ref={containerRef}>
      <div className="fixed invisible flex">
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
        <ShowMoreButton ref={showMoreMeasureRef} />
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
      {hiddenItems.length > 0 && <ShowMoreButton ref={showMoreRef} />}
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
