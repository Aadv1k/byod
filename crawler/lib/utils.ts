import crypto from "node:crypto";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function md5(text: string): string {
    let hash = crypto.createHash("md5").update(text).digest("hex");
    return hash;
}
