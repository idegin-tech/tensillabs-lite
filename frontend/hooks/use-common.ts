import { useParams } from "next/navigation";

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
