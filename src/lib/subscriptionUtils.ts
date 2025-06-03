import { prisma } from './prisma';
import { UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export interface SubscriptionLimits {
  maxProductListings?: number;
  maxJobApplications?: number;
  hasAdvancedAnalytics: boolean;
  hasPrioritySupport: boolean;
  hasEmailNotifications: boolean;
  hasPriorityInSearch: boolean;
  hasCustomBranding?: boolean;
  hasApiAccess?: boolean;
  hasFeaturedBadge?: boolean;
}

export const getSubscriptionLimits = (plan: SubscriptionPlan, userRole: UserRole): SubscriptionLimits => {
  // Admin users have unlimited access to everything
  if (userRole === UserRole.ADMIN) {
    return {
      maxProductListings: undefined,
      maxJobApplications: undefined,
      hasAdvancedAnalytics: true,
      hasPrioritySupport: true,
      hasEmailNotifications: true,
      hasPriorityInSearch: true,
      hasCustomBranding: true,
      hasApiAccess: true,
      hasFeaturedBadge: true,
    };
  }

  const baseLimits: SubscriptionLimits = {
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
    hasEmailNotifications: false,
    hasPriorityInSearch: false,
  };

  switch (plan) {
    case SubscriptionPlan.FREE:
      if (userRole === UserRole.PHARMACIST) {
        return {
          ...baseLimits,
          maxJobApplications: 5, // Limited job applications
        };
      } else {
        return {
          ...baseLimits,
          maxProductListings: 10, // Limited product listings
        };
      }

    case SubscriptionPlan.STANDARD:
      if (userRole === UserRole.PHARMACIST) {
        return {
          ...baseLimits,
          hasAdvancedAnalytics: true,
          hasEmailNotifications: true,
          hasPriorityInSearch: true,
          maxJobApplications: undefined, // Unlimited
        };
      } else {
        return {
          ...baseLimits,
          hasAdvancedAnalytics: true,
          hasEmailNotifications: true,
          hasPriorityInSearch: true,
          hasPrioritySupport: true,
          maxProductListings: undefined, // Unlimited
        };
      }

    case SubscriptionPlan.PREMIUM:
      // Premium is only available for pharmacy owners
      if (userRole === UserRole.PHARMACY_OWNER) {
        return {
          ...baseLimits,
          hasAdvancedAnalytics: true,
          hasEmailNotifications: true,
          hasPriorityInSearch: true,
          hasPrioritySupport: true,
          hasCustomBranding: true,
          hasApiAccess: true,
          hasFeaturedBadge: true,
          maxProductListings: undefined, // Unlimited
        };
      }
      break;
  }

  return baseLimits;
};

export const checkSubscriptionStatus = async (userId: string, userRole: UserRole) => {
  // Admin users have unlimited access
  if (userRole === UserRole.ADMIN) {
    return {
      plan: SubscriptionPlan.PREMIUM, // Treat as premium for limits
      status: SubscriptionStatus.ACTIVE,
      expiresAt: null,
      daysRemaining: null,
      isExpired: false,
      limits: getSubscriptionLimits(SubscriptionPlan.PREMIUM, userRole)
    };
  }

  let profile;

  if (userRole === UserRole.PHARMACIST) {
    profile = await prisma.pharmacistProfile.findUnique({
      where: { userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    });
  } else if (userRole === UserRole.PHARMACY_OWNER) {
    profile = await prisma.pharmacyOwnerProfile.findUnique({
      where: { userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    });
  }

  if (!profile) {
    return null;
  }

  // Check if subscription is expired
  const isExpired = profile.subscriptionExpiresAt && 
    new Date() > profile.subscriptionExpiresAt;

  const effectivePlan = isExpired ? SubscriptionPlan.FREE : profile.subscriptionPlan;
  const effectiveStatus = isExpired ? SubscriptionStatus.EXPIRED : profile.subscriptionStatus;

  return {
    plan: effectivePlan,
    status: effectiveStatus,
    expiresAt: profile.subscriptionExpiresAt,
    isExpired,
    limits: getSubscriptionLimits(effectivePlan, userRole),
  };
};

export const canPerformAction = async (
  userId: string, 
  userRole: UserRole, 
  action: 'CREATE_PRODUCT' | 'APPLY_JOB' | 'ACCESS_ANALYTICS' | 'CUSTOM_BRANDING'
): Promise<{ allowed: boolean; reason?: string }> => {
  // Admin users can perform any action
  if (userRole === UserRole.ADMIN) {
    return { allowed: true };
  }

  const subscription = await checkSubscriptionStatus(userId, userRole);
  
  if (!subscription) {
    return { allowed: false, reason: 'Subscription information not found' };
  }

  const { limits } = subscription;

  switch (action) {
    case 'CREATE_PRODUCT':
      if (userRole !== UserRole.PHARMACY_OWNER) {
        return { allowed: false, reason: 'Only pharmacy owners can create products' };
      }
      if (limits.maxProductListings === undefined) {
        return { allowed: true }; // Unlimited
      }
      // Check current product count
      const productCount = await prisma.product.count({
        where: {
          pharmacyOwner: { userId }
        }
      });
      if (productCount >= limits.maxProductListings) {
        return { 
          allowed: false, 
          reason: `Product limit reached (${limits.maxProductListings}). Upgrade your subscription for unlimited products.` 
        };
      }
      return { allowed: true };

    case 'APPLY_JOB':
      if (userRole !== UserRole.PHARMACIST) {
        return { allowed: false, reason: 'Only pharmacists can apply for jobs' };
      }
      if (limits.maxJobApplications === undefined) {
        return { allowed: true }; // Unlimited
      }
      // Note: You would need to implement job application tracking
      // For now, we'll assume it's allowed
      return { allowed: true };

    case 'ACCESS_ANALYTICS':
      return { 
        allowed: limits.hasAdvancedAnalytics, 
        reason: limits.hasAdvancedAnalytics ? undefined : 'Advanced analytics requires Standard or Premium subscription' 
      };

    case 'CUSTOM_BRANDING':
      return { 
        allowed: limits.hasCustomBranding || false, 
        reason: limits.hasCustomBranding ? undefined : 'Custom branding requires Premium subscription' 
      };

    default:
      return { allowed: false, reason: 'Unknown action' };
  }
};