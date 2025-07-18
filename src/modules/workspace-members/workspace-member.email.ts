import { APP_CONFIG } from '../../config/app.config';

export const workspaceInvitationEmail = ({
  workspaceName,
  firstName,
}: {
  firstName: string;
  workspaceName: string;
}) => {
  const heading = `You've been invited to join ${workspaceName}`;
  const body = `
    <p>Hello ${firstName},</p>
    <p>You have been invited you to collaborate in the <strong>"${workspaceName}"</strong> workspace on ${APP_CONFIG.name}.</p>
    <p>Join your team to start collaborating.</p>
  `;
  const ctaText = 'Accept Invitation';
  const ctaUrl = `${APP_CONFIG.app_url}/workspaces`;

  return { heading, body, ctaText, ctaUrl };
};
