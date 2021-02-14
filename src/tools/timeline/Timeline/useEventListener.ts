import { RefObject, useEffect } from 'react';

export const useEventListener = (ref: RefObject<HTMLElement>, event: string, callback: (event: Event) => any): void => {
    useEffect(() => {
        ref.current?.addEventListener(event, callback);
        return () => {
            ref.current?.removeEventListener(event, callback);
        };
    }, [ref.current, event, callback]);
};
