import NavbarItem from "@/components/organisms/navigation/navbar/NavbarItem";
import Button from "@/components/atoms/button";
import Text from "@/components/atoms/text";
import Dropdown from "@/components/molecules/dropdown";
import { useSize } from "@/hooks/use-size";
import { debounce } from "@/utils/debounce";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfilePageState } from "@/types/profile-page-state";
import { useProfilePage } from "../context/profile-page-context";

interface ProfileNavbarProps {
  className?: string;
}

type NavbarItem = {
  name: string;
  href?: string;
  isOwnerOnly?: boolean;
};

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({ className = "" }) => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const navigate = useNavigate();
  const location = useLocation();
  const { userParam, isOwner } = useProfilePage();

  const [containerRef, containerSize] = useSize<HTMLDivElement>();
  const showMoreRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<HTMLDivElement[]>([]);

  const navbarItems = useMemo(() => [
    { name: t("user:profileMenu.posts"), href: `/${userParam}`, isOwnerOnly: false },
    { name: t("user:profileMenu.friends"), href: `/${userParam}/friends`, isOwnerOnly: false },
    { name: t("user:profileMenu.photos"), href: `/${userParam}/photos`, isOwnerOnly: false },
    { name: t("user:profileMenu.videos"), href: `/${userParam}/videos`, isOwnerOnly: false },
    { name: t("user:profileMenu.about"), href: `/${userParam}/about`, isOwnerOnly: false },
    { name: t("user:profileMenu.settings"), href: `/${userParam}/settings`, isOwnerOnly: true },
  ], [userParam, t]);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [visibleItems, setVisibleItems] = useState<NavbarItem[]>([]);
  const [hiddenItems, setHiddenItems] = useState<NavbarItem[]>([]);
  const [isChooseHiddenItem, setIsChooseHiddenItem] = useState<boolean>(false);

  const updateChooseHiddenItem = () => {
    const currentPath = location.pathname;
    const foundInHidden = hiddenItems.some((itemRefs) => itemRefs.href === currentPath);
    setIsChooseHiddenItem(foundInHidden);
  };

  useLayoutEffect(() => {
    if (containerSize.width === 0) return;

    const handleResize = () => {
      let total = 0;
      const newVisibleItems: NavbarItem[] = [];
      const newHiddenItems: NavbarItem[] = [];

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

    const debouncedHandle = debounce(handleResize, 50); // 50ms delay
    debouncedHandle(); // chạy ngay lần đầu
  }, [containerSize.width, isOwner, navbarItems]); // Thêm navbarItems vào dependency

  useEffect(() => {
    updateChooseHiddenItem();
  }, [location.pathname, hiddenItems]);

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
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
              />
            </div>
          );
        })}
      </div>
      {visibleItems.map((item, index) => (
        <div key={index}>
          <NavbarItem
            path={item.href ?? ""}
            children={item.name}
            onClick={() => setShowDropdown(false)}
          />
        </div>
      ))}
      {hiddenItems.length > 0 && (
        <Button
          variant="secondary"
          className={`relative overflow-hidden
                bg-transparent hover:bg-[var(--main-bg-color)]`}
          onClick={() => setShowDropdown(!showDropdown)}
          ref={showMoreRef}
        >
          <Text
            className={`
                   whitespace-nowrap
                   ${isChooseHiddenItem ? "!text-single-main" : "text-[var(--text-color)]"}
                `}
          >
            More <i className="fa-solid fa-caret-down ml-1"></i>
          </Text>
          {isChooseHiddenItem && (
            <div
              className="absolute bg-single-main h-[2px] rounded-full
                            w-full bottom-0 left-0"
            />
          )}
        </Button>
      )}
      {showDropdown && (
        <Dropdown
          className="absolute z-[9997] top-[100%] m-0 bg-[var(--main-bg-color)] shadow-lg rounded-md
                        w-[95%] -translate-x-1/2 left-1/2 p-2
                    "
          showPolygon={false}
          isShow={showDropdown}
          items={hiddenItems.map((item) => ({
            id: item.name,
            content: (
              <div
                className={`flex justify-between items-center
                                    ${location.pathname === item.href ? "text-single-main" : "text-[var(--text-color)]"}
                                `}
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
