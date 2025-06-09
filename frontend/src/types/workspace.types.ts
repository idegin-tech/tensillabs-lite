export interface Workspace {
    _id: string;
    name: string;
    description: string | null;
    logoURL: string | null;
    bannerURL: string | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceMember {
    _id: string;
    user: string;
    workspace: Workspace;
    firstName: string;
    middleName: string | null;
    lastName: string;
    primaryEmail: string;
    secondaryEmail: string | null;
    permission: 'super_admin' | 'admin' | 'manager' | 'regular';
    status: 'pending' | 'active' | 'suspended';
    bio: string | null;
    workPhone: string | null;
    mobilePhone: string | null;
    avatarURL: {
        sm: string;
        original: string;
    };
    lastActiveAt: string | null;
    invitedBy: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceMembershipResponse {
    success: boolean;
    message: string;
    payload: {
        docs: WorkspaceMember[];
        totalDocs: number;
        limit: number;
        page: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        nextPage: number | null;
        prevPage: number | null;
        pagingCounter: number;
    };
    timestamp: string;
}
