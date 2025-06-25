import Textbox, { Size } from "./Textbox"

interface SearchBoxProps {
    placeholder?: string;
    className?: string;
    size?: Size;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    placeholder = "Search...",
    className = "",
    size = "sm",
    onChange = () => {},
    ...props
}) => {

    return (
        <div className={`relative ${className} h-fit w-fit`}>
            <Textbox {...props} 
                placeholder={placeholder}
                size={size}
                className="pl-9"
                onChange={onChange}>
            </Textbox>
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2"></i>
        </div>
    )
}

export default SearchBox;