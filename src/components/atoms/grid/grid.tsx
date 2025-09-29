import { ComponentProps } from "@/components/common/types/component-type";
import GridItem from "./grid-item";

interface GridProps extends ComponentProps {
  cols?: number;
  rows?: number;
  gap?: number;
  flow?: "row" | "col" | "dense" | "row-dense" | "col-dense";
}

interface GridComposition {
  Item: typeof GridItem;
}

const Grid: React.FC<GridProps> & GridComposition = ({
  cols = 1,
  rows = 1,
  gap = 0,
  flow = "row",
  className = "",
  children,
  ...props
}) => {

  // Sử dụng style inline để đảm bảo CSS Grid hoạt động
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
  };

  const gapClass = gap > 0 ? `gap-[${gap}px]` : "";
  const flowClass = `grid-flow-${flow}`;

  return (
    <div 
      className={`grid ${gapClass} ${flowClass} ${className}`} 
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  )
}

Grid.Item = GridItem;
export default Grid;
