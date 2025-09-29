import { ComponentProps } from "@/components/common/types/component-type";

interface GridItemProps extends ComponentProps {
  as?: React.ElementType;
  colSpan?: number;
  rowSpan?: number;
  colStart?: number;
  rowStart?: number;
  alignSelf?: "start" | "end" | "center" | "stretch";
  justifySelf?: "start" | "end" | "center" | "stretch";
}

const GridItem: React.FC<GridItemProps> = ({
  as: Component = "div",
  colSpan = 1,
  rowSpan = 1,
  colStart,
  rowStart,
  alignSelf,
  justifySelf,
  className,
  children,
}) => {
  // Sử dụng style inline để đảm bảo grid properties hoạt động
  const gridStyle: React.CSSProperties = {
    gridColumn: `span ${colSpan} / span ${colSpan}`,
    gridRow: `span ${rowSpan} / span ${rowSpan}`,
    ...(colStart && { gridColumnStart: colStart }),
    ...(rowStart && { gridRowStart: rowStart }),
    ...(alignSelf && { alignSelf }),
    ...(justifySelf && { justifySelf }),
  };

  return (
    <Component
      className={className}
      style={gridStyle}
    >
      {children}
    </Component>
  );
};

export default GridItem;
