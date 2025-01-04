/* // src/components/ui/ArtGalleryMenu.js

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown-menu"; // Adjust the path based on your file structure

function ArtGalleryMenu() {
  return (
    <nav className="bg-white shadow-md p-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="font-bold text-lg">Categories</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Art Styles</DropdownMenuLabel>
          <DropdownMenuItem>Abstract</DropdownMenuItem>
          <DropdownMenuItem>Contemporary</DropdownMenuItem>
          <DropdownMenuItem>Traditional</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Price Range</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked>Under $100</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>$100 - $500</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Over $500</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="font-bold text-lg ml-4">Sort By</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioItem>Price: Low to High</DropdownMenuRadioItem>
          <DropdownMenuRadioItem>Price: High to Low</DropdownMenuRadioItem>
          <DropdownMenuRadioItem>Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem>Oldest</DropdownMenuRadioItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default ArtGalleryMenu;
 */

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./ui/NavigationMenu";

function ArtGalleryMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/abstract">Abstract</NavigationMenuLink>
          <NavigationMenuLink href="/contemporary">Contemporary</NavigationMenuLink>
          <NavigationMenuLink href="/traditional">Traditional</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Sort By</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/sort/price-asc">Price: Low to High</NavigationMenuLink>
          <NavigationMenuLink href="/sort/price-desc">Price: High to Low</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}

export default ArtGalleryMenu;
