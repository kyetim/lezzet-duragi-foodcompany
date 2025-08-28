import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = false
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${width} ${height} ${
        rounded ? 'rounded-full' : 'rounded'
      } ${className}`}
    />
  );
};

export const MenuItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48 rounded-lg" />
      
      {/* Title skeleton */}
      <Skeleton className="w-3/4 h-6" />
      
      {/* Description skeleton */}
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
      </div>
      
      {/* Price and button skeleton */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-24 h-9 rounded-md" />
      </div>
    </div>
  );
};

export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
      
      <div className="flex-1 space-y-2">
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      
      <div className="flex items-center space-x-2">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </div>
  );
};

export const OrderSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      
      <div className="border-t pt-4 space-y-3">
        <CartItemSkeleton />
        <CartItemSkeleton />
      </div>
      
      <div className="border-t pt-4 flex justify-between">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-24 h-6" />
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Profile header */}
      <div className="flex items-center space-x-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-48 h-4" />
        </div>
      </div>
      
      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <Skeleton className="w-20 h-4 mb-2" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
        <div>
          <Skeleton className="w-16 h-4 mb-2" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
        <div>
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex space-x-3">
        <Skeleton className="w-24 h-10 rounded-md" />
        <Skeleton className="w-20 h-10 rounded-md" />
      </div>
    </div>
  );
};