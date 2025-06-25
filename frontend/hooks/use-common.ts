import { useParams } from "next/navigation";
import { useCallback, useRef } from "react";

export default function useCommon(){
    const { member_id } = useParams<{ member_id: string }>();
    
    const getPathToApp = (appSlug: string):string => {
        return `/workspaces/${member_id}/apps/${appSlug}`;
    } 

    return {
        member_id,
        getPathToApp
    }
}

export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    ) as T;

    return debouncedCallback;
}
