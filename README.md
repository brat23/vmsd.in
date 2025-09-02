# Project vmsd.in

This is the main README file for the vmsd.in project.

## Deployment Instructions

This section outlines the steps to deploy the `build` directory to your cPanel hosting.

### 1. Initial cPanel Repository Setup

First, ensure your GitHub repository is cloned to your cPanel.

*   Go to your cPanel dashboard -> **"Git Version Control"**.
*   Click **"Create"**.
*   In the "Clone a Repository" section, use your GitHub repository's HTTPS URL: `https://github.com/brat23/vmsd.in.git`
*   If prompted for credentials, use your GitHub username and a Personal Access Token (PAT) as the password. (Refer to GitHub settings -> Developer settings -> Personal access tokens to generate a PAT with `repo` scope).

### 2. Local Repository Setup

Add your cPanel repository as a remote to your local project. Replace the URL with your actual cPanel Git Clone URL (e.g., `ssh://yaxwyecy@server1.dnspark.in/home/yaxwyecy/repositories/vmsd.in`).

```bash
git remote add cpanel ssh://yaxwyecy@server1.dnspark.in/home/yaxwyecy/repositories/vmsd.in
```

### 3. Build Your Project

Before deploying, ensure your `build` directory is up-to-date with the latest optimized files.

```bash
npx gulp
```

### 4. Deploy `build` Directory to cPanel

This command pushes only the contents of your local `build` directory to the `main` branch of your cPanel repository.

```bash
git subtree push --prefix=build cpanel main
```

### 5. Configure Automatic Deployment on cPanel (`.cpanel.yml`)

To automatically copy the deployed `build` files from your cPanel repository to your website's public directory (e.g., `public_html`), create a file named `.cpanel.yml` in the **root of your local project** (`E:\vmsd.in\vmsd\`).

Add the following content to `.cpanel.yml`. **Ensure you replace `yaxwyecy` with your actual cPanel username.**

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/yaxwyecy/public_html/
    - /bin/cp -R * $DEPLOYPATH
```

### 6. Push `.cpanel.yml` to cPanel

Commit the new `.cpanel.yml` file and push it to your cPanel remote.

```bash
git add .cpanel.yml
git commit -m "Add .cpanel.yml for cPanel deployment"
git push cpanel main
```

### 7. Trigger Deployment on cPanel

After pushing changes to your cPanel repository, you need to tell cPanel to pull those changes and run the deployment tasks defined in `.cpanel.yml`.

*   Go to your cPanel dashboard -> **"Git Version Control"**.
*   Find your repository and click **"Manage"**.
*   Click **"Pull or Deploy"** (or a similar button) to initiate the pull and deployment process.

This will pull the latest `build` files into your cPanel repository and then copy them to your `public_html` directory.

