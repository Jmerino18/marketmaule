
import { getDb } from "./api/queries/connection";
import { entrepreneurs } from "./db/schema";

async function test() {
  try {
    const result = await getDb().select().from(entrepreneurs).limit(1);
    console.log("Has data:", result.length > 0);
    if (result.length > 0) {
      console.log("Row:", JSON.stringify(result[0], null, 2));
    }
  } catch (e: any) {
    console.log("Error:", e.message);
  }
}

test();
