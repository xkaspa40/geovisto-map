import { RefObject, useEffect } from "react";

export const useEventListener = (
    ref: RefObject<HTMLElement>,
    event: string,
    callback: (event: Event) => any,
    disabled = false,
): void => {
    useEffect(() => {
        if (!disabled) {
            ref.current?.addEventListener(event, callback);
        }
        return () => {
            if (!disabled) {
                ref.current?.removeEventListener(event, callback);
            }
        };
    }, [ref.current, event, callback, disabled]);
};
