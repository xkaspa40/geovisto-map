import { HandleItem } from 'react-compound-slider';

// TODO start and end handler can push current value handler
export const modeNoCross = (curr: HandleItem[], next: HandleItem[]): HandleItem[] => {
    for (let i = 0; i < curr.length; i++) {
        if (curr[i].key !== next[i].key) {
            return curr;
        }
    }
    return next;
};

