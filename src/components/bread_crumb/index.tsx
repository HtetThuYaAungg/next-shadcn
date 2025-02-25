// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";

// const Breadcrumb = () => {
//     const pathname = usePathname();
//     const pathSnippets = pathname.split("/").filter((i) => i);

//     // Define default breadcrumb for "Home"
//     const defaultBreadcrumb = (
//         <li key="home" className="text-secondaryStrongColor">
//             <Link href={"/"} className=" text-textGrayColor hover:text-activeColor text-sm font-walone_regular">
//                 Home
//             </Link>
//         </li>
//     );

//     const breadcrumbItems = pathSnippets.map((snippet, index) => {
//         const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
//         const isFirst = index === 0;
//         const isLast = index === pathSnippets.length - 1;

//         const breadcrumbLabel = snippet.charAt(0).toUpperCase() + snippet.slice(1);

//         return isLast ? (
//             <li key={url} className="text-activeColor font-semibold cursor-default text-sm font-walone_regular">
//                 {breadcrumbLabel}
//             </li>
//         ) : (
//             <li key={url} >
//                 {isFirst ? (
//                     <Link href={url} className=" text-textGrayColor hover:text-activeColor text-sm font-walone_regular">
//                         {breadcrumbLabel}
//                     </Link>
//                 ) : (
//                     <Link href={url} className=" text-textGrayColor hover:text-activeColor text-sm font-walone_regular">
//                         {breadcrumbLabel}
//                     </Link>
//                 )}
//             </li>
//         );
//     });

//     // Combine default "Home" breadcrumb with dynamic items
//     const allBreadcrumbItems = [defaultBreadcrumb, ...breadcrumbItems];

//     return (
//         <nav aria-label="breadcrumb">
//             <ul className="flex items-center space-x-2 ml-2">
//                 {allBreadcrumbItems.map((item, index) => (
//                     <React.Fragment key={index}>
//                         {item}
//                         {index < allBreadcrumbItems.length - 1 && (
//                             <span className=" text-textGrayColor text-sm font-walone_regular">{" / "}</span>
//                         )}
//                     </React.Fragment>
//                 ))}
//             </ul>
//         </nav>
//     );
// };

// export default Breadcrumb;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
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
