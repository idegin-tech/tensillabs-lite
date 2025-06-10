import { useParams } from "react-router-dom";

export default function useCommon() {
    const { member_id } = useParams<{ member_id: string }>();

    const getPathToApp = (appSlug:string):string => {
        return `/workspaces/${member_id}/apps/${appSlug}`
    }

    return {
        getPathToApp
    };
}

