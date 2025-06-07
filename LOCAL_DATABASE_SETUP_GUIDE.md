# Local PostgreSQL Database Setup Guide

This guide explains how to set up a local PostgreSQL database for the PharmaEgypt project using pgAdmin.

**Step 1: Download and Install PostgreSQL and pgAdmin**

1.  **PostgreSQL:** This is the database management system we'll use. You can download it from the official website: [PostgreSQL Downloads](https://www.postgresql.org/download/)
    *   Choose your operating system (likely Windows) and download the latest stable version.
    *   During installation, you'll be asked to set a password for the superuser (usually named `postgres`). **Remember this password well, as you'll need it.**
    *   Keep the default settings for the rest of the installation steps.

2.  **pgAdmin:** This tool provides a graphical interface to manage your database. Download it from here: [pgAdmin Download](https://www.pgadmin.org/download/)
    *   Select your operating system and download the compatible version.
    *   Installation is straightforward.

**Step 2: Create a New Local Database**

1.  Open pgAdmin.
2.  When it opens, it might ask for a master password for pgAdmin itself (this is different from the `postgres` database user password). If it's your first time, you'll be prompted to create one.
3.  On the left-hand side, you'll see "Servers". Right-click on it and select `Create -> Server...`.
4.  In the **General** tab, give your server a name (e.g., `PharmaEgyptLocal`).
5.  Go to the **Connection** tab:
    *   **Host name/address:** Enter `localhost`.
    *   **Port:** Keep it as `5432` (the default PostgreSQL port).
    *   **Maintenance database:** Keep it as `postgres`.
    *   **Username:** Enter `postgres` (the superuser).
    *   **Password:** Enter the password you set for the `postgres` user during PostgreSQL installation.
    *   Click **Save**.
6.  The new server should now appear under "Servers". Right-click on the server name you just created (e.g., `PharmaEgyptLocal`) and select `Create -> Database...`.
7.  Name your database, for example, `pharmaegy_dev`.
8.  Click **Save**.

**Step 3: Modify the `.env` File in Your Project**

Now, you need to configure your project to connect to this local database instead of the remote one. Open the `.env` file located in the root of your project. You'll find a line for `DATABASE_URL`.

Modify it as follows:

```
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/pharmaegy_dev?schema=public"
```

**Explanation of the changes:**

*   `postgres`: The username for your local database.
*   `YOUR_POSTGRES_PASSWORD`: Replace this with the password you set for the `postgres` user during PostgreSQL installation.
*   `localhost`: Indicates that the database is on your local machine.
*   `5432`: The PostgreSQL port.
*   `pharmaegy_dev`: The name of the local database you just created in pgAdmin.
*   `?schema=public`: Specifies the default schema.

**Important:** If you have a `POSTGIS_URL` in your `.env` file, you can comment it out (by adding a `#` at the beginning of the line) or modify it similarly if you intend to use PostGIS locally (though you likely won't need to change it initially).

**Step 4: Run Migrations (Create Database Tables)**

After updating the `DATABASE_URL`, you need to run migrations to build the tables in your new local database, matching the schema of the remote database.

1.  Open your terminal or command prompt in your project folder.
2.  Run the following command:
    ```bash
    npx prisma migrate dev
    ```
    This command will look at your schema in `prisma/schema.prisma` and create the tables in your new local database.

3.  (Optional but important) If you have seed data (like admin user data) that you want in your local database, run your seeding command. It's usually something like:
    ```bash
    npx prisma db seed
    ```
    (Check your `package.json` under `scripts` for the exact command if it's different).

**Step 5: Run Your Project**

Now, run your project as usual (typically `npm run dev` or `yarn dev`). The project should now connect to your local database.

**Important Notes:**

*   **pgAdmin:** You can use pgAdmin to view the tables, the data within them, and make any necessary modifications.
*   **Security:** Since this is a local database, its password won't be exposed outside your machine, but still, keep it safe.
*   **Switching Back to Remote:** If you want to switch back to the remote Supabase database, simply revert the `DATABASE_URL` in your `.env` file to its original value.

If you encounter any issues or get stuck, feel free to ask for help. Good luck!