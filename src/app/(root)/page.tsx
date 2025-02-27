"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit, Ellipsis, Eye, Trash } from "lucide-react";
import { DataTable } from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReactTable } from "@tanstack/react-table";

const queryClient = new QueryClient();

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Helper function to apply filters
function applyFilters(item: Post, filters: Record<string, any>) {
  return Object.entries(filters).every(([key, filter]) => {
    const value = item[key as keyof Post];
    const stringValue = String(value).toLowerCase();
    const value1 = filter.value1.toLowerCase();
    const value2 = filter.value2.toLowerCase();

    const applyCondition = (type: string, filterValue: string) => {
      switch (type) {
        case "contains":
          return stringValue.includes(filterValue);
        case "notContains":
          return !stringValue.includes(filterValue);
        case "equals":
          return stringValue === filterValue;
        case "notEquals":
          return stringValue !== filterValue;
        case "startsWith":
          return stringValue.startsWith(filterValue);
        case "endsWith":
          return stringValue.endsWith(filterValue);
        case "blank":
          return stringValue === "";
        case "notBlank":
          return stringValue !== "";
        default:
          return true;
      }
    };

    const condition1 = applyCondition(filter.type1, value1);
    const condition2 = applyCondition(filter.type2, value2);

    return filter.operator === "AND"
      ? condition1 && condition2
      : condition1 || condition2;
  });
}

export default function PostsPage() {
  const columns: { accessor: keyof Post; header: string; sortable: boolean }[] =
    [
      { accessor: "id", header: "ID", sortable: true },
      { accessor: "title", header: "Title", sortable: true },
      { accessor: "body", header: "Content", sortable: true },
      { accessor: "userId", header: "User ID", sortable: true },
    ];

  const fetchPosts = async ({
    page,
    pageSize,
    sortBy,
    sortOrder,
    filters,
  }: any) => {
    // Fetch all posts first (JSONPlaceholder doesn't support pagination)
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    let posts: Post[] = await response.json();

    // Apply filters
    if (filters && Object.keys(filters).length > 0) {
      posts = posts.filter((post) => applyFilters(post, filters));
    }

    // Apply sorting
    if (sortBy) {
      posts.sort((a, b) => {
        if (a[sortBy as keyof Post] < b[sortBy as keyof Post])
          return sortOrder === "asc" ? -1 : 1;
        if (a[sortBy as keyof Post] > b[sortBy as keyof Post])
          return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const start = (page - 1) * pageSize;
    const paginatedPosts = posts.slice(start, start + pageSize);

    return {
      items: paginatedPosts,
      total: posts.length,
      hasMore: start + pageSize < posts.length,
    };
  };

  const handleAction = (action: string, postId: number) => {
    switch (action) {
      case "edit":
        console.log("Editing post with ID:", postId);
        break;
      case "delete":
        console.log("Deleting post with ID:", postId);
        break;
      case "view":
        console.log("Viewing post with ID:", postId);
        break;
      default:
        break;
    }
  };

  //   const actions = (post: Post) => (
  //     <div className="flex space-x-2">
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={() => handleAction("edit", post.id)}
  //       >
  //         <Edit className="h-4 w-4" />
  //       </Button>
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={() => handleAction("delete", post.id)}
  //       >
  //         <Trash className="h-4 w-4" />
  //       </Button>
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={() => handleAction("view", post.id)}
  //       >
  //         <Eye className="h-4 w-4" />
  //       </Button>
  //     </div>
  //     );

  const actions = (post: Post) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={() => handleAction("view", post.id)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleAction("edit", post.id)}>
          Detail
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleAction("delete", post.id)}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <main className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Posts</h1>
        <DataTable
          columns={columns}
          fetchData={fetchPosts}
          actions={actions}
          queryKey="post"
        />
      </main>
    </QueryClientProvider>
  );
}
