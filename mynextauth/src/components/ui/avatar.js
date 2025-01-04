import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

// Utility function to combine class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Avatar Root Component
export const Avatar = React.forwardRef(function Avatar({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
});

// Avatar Image Component
export const AvatarImage = React.forwardRef(function AvatarImage({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
});

// Avatar Fallback Component
export const AvatarFallback = React.forwardRef(function AvatarFallback({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn("bg-muted flex h-full w-full items-center justify-center rounded-full", className)}
      {...props}
    />
  );
});
