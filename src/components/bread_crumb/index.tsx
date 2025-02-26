"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const pathSnippets = pathname.split("/").filter((i) => i);

  // Default breadcrumb for "Home"
  const defaultBreadcrumb = (
    <BreadcrumbItem key="home">
      <Link
        href="/"
        className="text-textGrayColor hover:text-activeColor text-sm font-walone_regular"
      >
        Home
      </Link>
    </BreadcrumbItem>
  );

  const breadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSnippets.length - 1;
    const breadcrumbLabel = snippet.charAt(0).toUpperCase() + snippet.slice(1);

    return isLast ? (
      <BreadcrumbItem key={url}>
        <BreadcrumbPage className="text-activeColor font-semibold text-sm font-walone_regular">
          {breadcrumbLabel}
        </BreadcrumbPage>
      </BreadcrumbItem>
    ) : (
      <BreadcrumbItem key={url}>
        <Link
          href={url}
          className="text-textGrayColor hover:text-activeColor text-sm font-walone_regular"
        >
          {breadcrumbLabel}
        </Link>
      </BreadcrumbItem>
    );
  });

  const allBreadcrumbItems = [defaultBreadcrumb, ...breadcrumbItems];

  return (
    <Breadcrumb>
      <BreadcrumbList className="ml-2">
        {allBreadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index < allBreadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
