import React from "react";

export function useSize<T extends HTMLElement>() {
    const ref = React.useRef<T>(null);
    const [size, setSize] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 });

    React.useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;

        const resizeObserver = new ResizeObserver(() => {
            setSize({
                width: el.offsetWidth,
                height: el.offsetHeight
            });
        });

        resizeObserver.observe(el);

        return () => {
            resizeObserver.disconnect();
        }
        
    }, [])

    return [ref, size] as const;
}