import { type AppBskyActorDefs, BskyAgent } from "@atproto/api";

import Link from "next/link";

const agent = new BskyAgent({
  service: "https://bsky.social",
});

const bskyTeam = [
  "jay.bsky.team",
  "pfrazee.com",
  "divy.zone",
  "dholms.xyz",
  "ansh.bsky.team",
  "bnewbold.bsky.team",
  "rose.bsky.team",
  "why.bsky.team",
  "jacob.gold",
  "emily.bsky.team",
  "renahlee.com",
];

type Props = {
  searchParams?: {
    handle?: string;
  };
};

export default async function Home({ searchParams }: Props) {
  try {
    if (searchParams?.handle) {
      await agent.login({
        identifier: process.env.BSKY_USERNAME!,
        password: process.env.BSKY_PASSWORD!,
      });

      const handle = searchParams.handle;

      let cursor: string | undefined;
      let following: AppBskyActorDefs.ProfileView[] = [];

      while (true) {
        const { data } = await agent.getFollowers({
          actor: handle,
          cursor,
        });
        cursor = data.cursor;
        following = following.concat(...data.followers);
        if (data.followers.length === 0) break;
      }

      return (
        <main className="min-h-screen">
          <div className="p-8 min-h-screen container flex flex-col items-center justify-center gap-8">
            <ul>
              {bskyTeam.map((person) => (
                <li key={person}>
                  <a
                    href={`https://staging.bsky.app/profile/${person}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {person}{" "}
                    {following.find((f) => f.handle === person) ? "✅" : "❌"}
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/" className="mt-8">
              Back
            </Link>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen">
        <div className="p-8 min-h-screen container flex flex-col items-center justify-center gap-8">
          <h1>See how many Bluesky team members are following you</h1>
          <form className="flex items-stretch border rounded">
            <input
              type="text"
              name="handle"
              placeholder="bluesky handle"
              className="px-2 py-1"
            />
            <button type="submit" className="px-4 border-l">
              Submit
            </button>
          </form>
        </div>
      </main>
    );
  } catch (err) {
    return (
      <main className="min-h-screen">
        <div className="p-8 min-h-screen container flex flex-col items-center justify-center gap-8">
          <p>Error: {(err as Error).message}</p>
          <Link href="/" className="mt-8">
            Back
          </Link>
        </div>
      </main>
    );
  }
}
