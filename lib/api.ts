import { ListingFormValues } from "@/validation/listingSchema";

export async function submitListing(data: ListingFormValues) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate potential error
  if (!data.title) {
    throw new Error("Invalid listing data");
  }

  // Simulate success
  console.log("Successfully submitted to backend:", data);
  
  return {
    success: true,
    listingId: Math.random().toString(36).substr(2, 9),
    reference: `KE-${Math.floor(1000 + Math.random() * 9000)}`,
  };
}
