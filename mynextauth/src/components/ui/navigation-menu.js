import React from "react";
import Link from "next/link";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root ref={ref} className={cn("relative z-10 flex items-center", className)} {...props}>
    <NavigationMenuList>{children}</NavigationMenuList>
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-4", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      "group inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium transition hover:bg-gray-100",
      className
    )}
    {...props}
  >
    <NavigationMenuList>{children}</NavigationMenuList>
    <ChevronDown className="ml-1 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "absolute left-0 top-full mt-1 w-56 rounded-md bg-white p-2 shadow-md",
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = React.forwardRef(({ className, children, href, ...props }, ref) => (
  <NavigationMenuPrimitive.Link asChild>
    <Link
      ref={ref}
      href={href}
      className={cn("block w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100", className)}
      {...props}
    >
    <NavigationMenuList>{children}</NavigationMenuList>
    </Link>
  </NavigationMenuPrimitive.Link>
));
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;

const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => (
  <div className="absolute left-0 top-full flex justify-center">
    <NavigationMenuPrimitive.Viewport
      className={cn("relative mt-2 w-56 bg-white shadow-lg", className)}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
};
