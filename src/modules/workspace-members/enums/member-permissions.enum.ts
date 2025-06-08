/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
export enum MemberPermissions {
  REGULAR = 'regular',
  MANAGER = 'manager',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export class PermissionHierarchy {
  private static readonly hierarchy = {
    [MemberPermissions.REGULAR]: 1,
    [MemberPermissions.MANAGER]: 2,
    [MemberPermissions.ADMIN]: 3,
    [MemberPermissions.SUPER_ADMIN]: 4,
  };

  static hasPermission(
    userPermission: string,
    requiredPermission: MemberPermissions,
  ): boolean {
    const userLevel = this.hierarchy[userPermission as MemberPermissions];
    const requiredLevel = this.hierarchy[requiredPermission];

    return userLevel >= requiredLevel;
  }

  static isSuperAdmin(permission: string): boolean {
    return permission === MemberPermissions.SUPER_ADMIN;
  }
}
