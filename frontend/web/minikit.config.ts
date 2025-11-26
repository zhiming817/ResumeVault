const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  "accountAssociation": {
    "header": "eyJmaWQiOjE1MjY3OTMsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg1NGFGN2NkMjVmNDJhMjUxMWRBNGIxQTlFYmZEMzE0QjU1NjM3MDQ1In0",
    "payload": "eyJkb21haW4iOiJtaW5pYXBwLmVndG95Lnh5eiJ9",
    "signature": "P+IlhPev3+ibq5AYOkO1t9gW7rPByRzbF2j/seNM0stIDc9q65kjeqm/TnmvY+KErmN3MTb4A977OuUzc9b3Cxw="
  },
  miniapp: {
    version: "1",
    name: "Cubey", 
    subtitle: "Your AI Ad Companion", 
    description: "Ads",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["marketing", "ads", "quickstart", "waitlist"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "Your AI Ad Companion - Smart Marketing Made Simple",
    ogTitle: "Cubey - Your AI Ad Companion",
    ogDescription: "Transform your marketing with Cubey, the AI-powered advertising companion that makes creating and managing ads effortless.",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
  baseBuilder: {
     ownerAddress:  "0x2a5D0b4035353b98b34A3a2E52B4DdAEB7a41B5c"
  }
} as const;

