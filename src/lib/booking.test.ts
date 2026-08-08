// import { describe, it, expect, vi, beforeEach } from "vitest";
// import { environmentManager } from "@tanstack/react-query";
// import { hydrateBlocks, fetchExperiences } from "./bookingPage"; // Adjust path to your file
// import * as pbModule from "./pocketbase";

// // 1. Mock the PocketBase module layer to isolate your logic from live database calls
// vi.mock("./pocketbase", async (importOriginal) => {
//   const actual = await importOriginal<typeof import("./pocketbase")>();
//   return {
//     ...actual,
//     // Provide a predictable string implementation for testing
//     buildImageUrl: (collId: string, id: string, file: string) => 
//       `http://mock-cms.local/files/${collId}/${id}/${file}`,
//     createPB_SSR: vi.fn(),
//     // Mock the standard client instance
//     pb: {
//       collection: vi.fn().mockReturnThis(),
//       getFullList: vi.fn(),
//     },
//   };
// });

// describe("Booking Page Service & Hydration", () => {
//   beforeEach(() => {
//     vi.restoreAllMocks(); // Clear spy history and returns between tests
//   });

//   // --- Testing pure data transformations ---
//   it("should transform storage blocks into hydrated blocks with valid URLs", () => {
//     const mockStorageBlocks = [
//       {
//         index: 0,
//         type: "image" as const,
//         asset_id: "asset123",
//         asset_collectionId: "coll456",
//         asset_file: "adventure.jpg",
//         alt: { default: "Kayaking down a river" }
//       }
//     ];

//     const result = hydrateBlocks(mockStorageBlocks as any);

//     // Verify properties we stripped out are missing
//     expect(result[0]).not.toHaveProperty("asset_id");
//     expect(result[0]).not.toHaveProperty("asset_collectionId");
    
//     // Verify the URL was successfully generated
//     expect(result[0]).toHaveProperty("url", "http://mock-cms.local/files/coll456/asset123/adventure.jpg");
//   });

//   // --- Testing the Server-Side SSR Branch ---
//   it("should use SSR client when environmentManager.isServer is true", async () => {
//     // Force the TanStack environment manager to report as a server environment
//     vi.spyOn(environmentManager, "isServer").mockReturnValue(true);

//     const mockSSRInstance = {
//       collection: vi.fn().mockReturnThis(),
//       getFullList: vi.fn().mockResolvedValue([
//         {
//           id: "page_1",
//           title: '{"default": "Wilderness Trek"}',
//           blocks: '[]',
//           expand: { coverImage: { collectionId: "c1", id: "i1", file: "cover.png" } }
//         }
//       ])
//     };
    
//     vi.mocked(pbModule.createPB_SSR).mockReturnValue(mockSSRInstance as any);

//     const res = await fetchExperiences("mock-auth-cookie");

//     expect(environmentManager.isServer).toHaveBeenCalled();
//     expect(pbModule.createPB_SSR).toHaveBeenCalledWith("mock-auth-cookie");
//     expect(res.success).toBe(true);
//     expect(res.value![0].title.default).toBe("Wilderness Trek");
//   });

//   // --- Testing the Client-Side Browser Branch ---
//   it("should fallback to standard client when environmentManager.isServer is false", async () => {
//     // Force the environment manager to report as a client browser environment
//     vi.spyOn(environmentManager, "isServer").mockReturnValue(false);

//     // Mock the global standard PocketBase client instance instead
//     vi.mocked(pbModule.pb.collection("").getFullList).mockResolvedValue([
//       {
//         id: "page_2",
//         title: '{"default": "Beach Escape"}',
//         blocks: '[]',
//         expand: { coverImage: { collectionId: "c2", id: "i2", file: "beach.png" } }
//       }
//     ]);

//     const res = await fetchExperiences();

//     expect(pbModule.createPB_SSR).not.toHaveBeenCalled();
//     expect(res.success).toBe(true);
//     expect(res.value![0].title.default).toBe("Beach Escape");
//   });
// });