# PharmaEgy Frontend Structure & Progress

This document outlines the frontend structure for the PharmaEgy platform, based on the backend API and Postman collection. It tracks the creation status of placeholder pages.

## General Guidelines for Placeholder Pages

1.  **Authentication**: Use the `ProtectedRoute` component to wrap pages, specifying `allowedRoles`.
2.  **Navigation**: Include the `Navigation` component at the top of each page, passing an appropriate `title`.
3.  **Layout**: Use a basic container (`<div class="container mx-auto p-4">`) for content.
4.  **Content**:
    *   Include a main heading (`<h1 class="text-2xl font-bold">Page Title</h1>`).
    *   Add a paragraph with placeholder text (e.g., `<p class="mt-4">[Feature description] will be implemented here.</p>`).
5.  **File Naming**: Follow Next.js conventions (e.g., `src/app/role/feature/page.tsx`).
6.  **Simplicity**: Keep placeholders minimal, focusing on structure and routing.

## Frontend Structure & Status

### 1. Authentication (Common)

*   **Login Page**: `src/app/auth/login/page.tsx` - **Status: Created**
*   **Pharmacist Registration Page**: `src/app/auth/register/pharmacist/page.tsx` - **Status: Created**
*   **Pharmacy Owner Registration Page**: `src/app/auth/register/pharmacy-owner/page.tsx` - **Status: Created**
*   **Admin Registration Page**: `src/app/auth/register/admin/page.tsx` - **Status: Created**

### 2. Admin Role (`src/app/admin/`)

*   **Dashboard**: `src/app/admin/dashboard/page.tsx` - **Status: Created**
*   **User Management (List, View, Modify Pharmacists & Owners)**: `src/app/admin/users/page.tsx` - **Status: Created**
    *   View/Edit Pharmacist Details: `src/app/admin/users/pharmacist/[id]/page.tsx` - **Status: Created**
    *   View/Edit Pharmacy Owner Details: `src/app/admin/users/owner/[id]/page.tsx` - **Status: Created**
*   **Payment & Subscription Management**: `src/app/admin/payments/page.tsx` - **Status: Created**
    *   View Subscription Details: `src/app/admin/payments/subscription/[id]/page.tsx` - **Status: Created**
*   **System Wallet Management**: `src/app/admin/wallet/page.tsx` - **Status: Created**

### 3. Pharmacist Role (`src/app/pharmacist/`)

*   **Dashboard**: `src/app/pharmacist/dashboard/page.tsx` - **Status: Created**
*   **Profile Management (View, Edit, CV Upload)**: `src/app/pharmacist/profile/page.tsx` - **Status: Created**
*   **My Subscriptions**: `src/app/pharmacist/subscriptions/page.tsx` - **Status: Created**
*   **My Payments**: `src/app/pharmacist/payments/page.tsx` - **Status: Created**


### 4. Pharmacy Owner Role (`src/app/pharmacy-owner/`)

*   **Dashboard**: `src/app/pharmacy-owner/dashboard/page.tsx` - **Status: Created**
*   **Profile Management (View, Edit Contact Person)**: `src/app/pharmacy-owner/profile/page.tsx` - **Status: Created**
*   **Pharmacy/Store Management (CRUD Pharmacy Details)**: `src/app/pharmacy-owner/store/page.tsx` - **Status: Created**
    *   Add New Pharmacy: `src/app/pharmacy-owner/store/new/page.tsx` - **Status: Created**
    *   Edit Pharmacy: `src/app/pharmacy-owner/store/[id]/edit/page.tsx` - **Status: Created**
    *   View Pharmacy Details: `src/app/pharmacy-owner/store/[id]/page.tsx` - **Status: Created**
*   **My Subscriptions**: `src/app/pharmacy-owner/subscriptions/page.tsx` - **Status: Created**
*   **My Payments**: `src/app/pharmacy-owner/payments/page.tsx` - **Status: Created**
*   **Pharmacist Search & Hiring**: `src/app/pharmacy-owner/pharmacists/page.tsx` - **Status: Created**
*   **Product/Inventory Management**: `src/app/pharmacy-owner/inventory/page.tsx` - **Status: Created**
    *   Add New Product: `src/app/pharmacy-owner/inventory/new/page.tsx` - **Status: Created**
    *   Edit Product: `src/app/pharmacy-owner/inventory/[productId]/edit/page.tsx` - **Status: Created**

## General Pages (Accessible by multiple roles if not specified otherwise)
*   **Browse Store Products**: `src/app/products/page.tsx` - **Status: Created** (Accessible by PHARMACIST, PHARMACY_OWNER)

---
*This file will be updated as new placeholder pages are created.*