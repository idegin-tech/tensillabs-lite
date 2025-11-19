Don't add code comments.
Don't add code comments.
Don't add code comments.
- Make sure to always use the Tanstack query setup.
- For pages or tabs always create a separate loading component for it which will be a beautifully laid out skeleton loader.
- Make sure to use the SectionPlaceholder where needed.
- Always follow NestJS and Next.js best practices.
- Use the schema dir and not the entity dir for database models.
- Frontend nextjs app is in the /frontend dir.
- Don't create any .md files unless I asked you to.
- For new components, make sure they depend on props a lot.

# Restructure plan
This is a turbo repo where the app are frontend, backend and control panel (TensilLabs Admin).
The frontend & backend will share the same fly deployment and root .env file.
We'll have a script that only runs on dev to generate the APP_KEY.

When a new client is onboarding we create a new client and workspace, fly API key and domain information (a client can have multiple workspaces), this will generate a stringified object which will be used as the APP_KEY env var, this object will hold the workspace, billing, license expiration and other information we'll need to keep track of each deployment.

Once the organization’s license has expired the workspace admin is prompted to pay which will call he control panel API and redirect them to paystack. Once the payment is successful, paystack send us the meta data which we'll use with the organization’s fly API key to set the particular fly machine’s APP_KEY  secret and then redeploy/restart the machine.

# Definitions
- APP_KEY: This is a json object which is converted to a jwt token. This object will hold the workspace information, cors origins, license, fly api key, billing and more.
- Control panel: This is where the TensilLabs admin can register and org, create a new workspace and generate the APP_KEY

# Restructure Tasks
[] Create the script to generate the APP_KEY for seeded and mock.
[] Delete the /workspaces page and the API it's calling.
[] Auth context should render the login page if no user is logged in.
[] Update all routes that use the /workspaces & /workspace/:member_id to only use /apps.
[] The backend cors allowed origin should come from the parsed APP_KEY.
[] Delete the create workspace backend endpoint.
[] Add backend env validation to also check for APP_KEY.

# New route structure
`/apps/home`: For the organization's intranet.
`/apps/spaces`: For the spaces app
`/apps/people`: For the HRMS app
`/apps/admin`: For the admin app
