/* eslint-disable @next/next/no-img-element */
import { type AppBskyActorDefs, BskyAgent } from "@atproto/api";
import { CheckIcon, ChevronLeft, XIcon } from "lucide-react";

import Link from "next/link";

const agent = new BskyAgent({
  service: "https://api.bsky.app",
});

const bskyTeam = [
  "jay.bsky.team",
  "pfrazee.com",
  "divy.zone",
  "dholms.xyz",
  "ansh.bsky.team",
  "bnewbold.net",
  "rose.bsky.team",
  "why.bsky.team",
  "jacob.gold",
  "emily.bsky.team",
  "jaz.bsky.social",
  "esb.lol",
  "foysal.codes",
  "danabra.mov",
];

type Props = {
  searchParams?: {
    handle?: string;
  };
};

export default async function Home({ searchParams }: Props) {
  try {
    if (searchParams?.handle) {
      const handle = searchParams.handle.startsWith("@") ? searchParams.handle.slice(1) : searchParams.handle;

      const requester = await agent.getProfile({
        actor: handle,
      });

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
        <main className="min-h-screen grid place-items-center">
          <div className="flex flex-col gap-8 w-full max-w-sm py-8 px-2">
            <div>
              <p className="text-sm">How many bsky devs are following</p>
              <div className="flex items-center gap-2 mt-2 rounded border p-2 w-full">
                <img
                  src={requester.data.avatar}
                  alt={
                    requester.data.displayName ?? "@" + requester.data.handle
                  }
                  className="w-10 h-10 rounded-full bg-neutral-300"
                />
                <div>
                  {requester.data.displayName && (
                    <p className="font-medium">{requester.data.displayName}</p>
                  )}
                  <p className="text-neutral-400 text-xs">
                    @{requester.data.handle}
                  </p>
                </div>
              </div>
            </div>
            <ul>
              {bskyTeam
                .sort(
                  (a, b) =>
                    ((following.find((f) => f.handle === a) ? 1 : -1) -
                      (following.find((f) => f.handle === b) ? 1 : -1)) *
                    -1
                )
                .map((person) => (
                  <li key={person}>
                    <a
                      href={`https://bsky.app/profile/${person}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      {following.find((f) => f.handle === person) ? (
                        <CheckIcon className="text-green-500" />
                      ) : (
                        <XIcon className="text-red-500" />
                      )}
                      {person}
                    </a>
                  </li>
                ))}
            </ul>
            <Link
              href="/"
              className="flex items-center mx-auto hover:underline"
            >
              <ChevronLeft size={18} /> Back
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
          <Link href="/" className="flex items-center mt-8 hover:underline">
            <ChevronLeft size={18} /> Back
          </Link>
        </div>
      </main>
    );
  }
}
