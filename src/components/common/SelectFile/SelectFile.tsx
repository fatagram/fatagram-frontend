import React from "react";

interface SelectFileProps {
    onChange: (file: File) => void,
    accept?: string,
    multiple?: boolean,
    className?: string,
    children: React.ReactNode,
}

const SelectFile: React.FC<SelectFileProps> = (
{ onChange, accept="*", multiple=false, className, children }
) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onChange(e.target.files[0]);
            e.target.value = "";
        }
    }

    return (
        <label className={`bg-[var(--btn-color)] transition-all duration-200 ease text-[var(--text-color)] hover:bg-[var(--btn-hover-color)] 
        rounded-lg px-4 py-2 cursor-pointer text-[13px]
        ${className} `}>
            <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleChange}
                    title="Select a file"/>
            {children}
        </label>
    )
}

export default SelectFile;