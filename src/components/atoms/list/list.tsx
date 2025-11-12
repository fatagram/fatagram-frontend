import { ComponentProps } from "@/components/common/types/component-type";

interface ListItemProps extends ComponentProps {
  key?: string | number;
}

interface ListProps extends ComponentProps {
  listItems?: ListItemProps[];
  itemClassName?: string;
}

export const ListItem: React.FC<ListItemProps> = ({ key, className, children, ...props }) => {
  return (
    <li key={key} className={className} {...props}>
      {children}
    </li>
  );
};

export const List: React.FC<ListProps> & { Item: typeof ListItem } = ({
  listItems,
  children,
  className,
  itemClassName,
}) => {
  return (
    <ul className={className}>
      {listItems?.map((item, index) => (
        <ListItem key={item.key ?? index} className={`${itemClassName} ${item.className}`}>
          {item.children}
        </ListItem>
      ))}
      {children}
    </ul>
  );
};

List.Item = ListItem;
