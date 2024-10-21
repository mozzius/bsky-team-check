/* eslint-disable @next/next/no-img-element */
import { type AppBskyActorDefs } from "@atproto/api";
import { CheckIcon, ChevronLeft, XIcon } from "lucide-react";

import Link from "next/link";
import { getAgent } from "~/lib/agent";

const agent = getAgent();

const bskyTeam = [
  "did:plc:oky5czdrnfjpqslsw2a5iclo", // jay.bsky.team
  "did:plc:ragtjsm2j2vknwkz3zp4oxrd", // pfrazee.com
  "did:plc:l3rouwludahu3ui3bt66mfvj", // divy.zone
  "did:plc:yk4dd2qkboz2yv6tpubpc6co", // dholms.xyz
  "did:plc:44ybard66vv44zksje25o7dz", // bnewbold.net
  "did:plc:qjeavhlw222ppsre4rscd3n2", // rose.bsky.team
  "did:plc:vpkhqolt662uhesyj6nxm7ys", // why.bsky.team
  "did:plc:vjug55kidv6sye7ykr5faxxn", // emilyliu.me
  "did:plc:q6gjnaw2blty4crticxkmujt", // jaz.bsky.social
  "did:plc:3jpt2mvvsumj2r7eqk4gzzjz", // esb.lol
  "did:plc:upo6iq6ekh66d4mbhmiy6se4", // foysal.codes
  "did:plc:fpruhuo22xkm5o7ttr2ktxdo", // danabra.mov
  "did:plc:oisofpd7lj26yvgiivf3lxsi", // haileyok.com
  "did:plc:tl7zqgil2irwndwojsxszceb", // jessica.bsky.team
  "did:plc:ksjfbda7262bbqmuoly54lww", // aaron.bsky.team
  "did:plc:p2cp5gopk7mgjegy6wadk3ep", // samuel.bsky.team
  "did:plc:linrigsaay5zenhg756ca6tg" // matthieu.bsky.team
]

type Props = {
  searchParams?: {
    handle?: string;
  };
};

export default async function Home({ searchParams }: Props) {
  try {
    if (searchParams?.handle) {
      const actor = searchParams.handle.startsWith("@")
        ? searchParams.handle.slice(1)
        : searchParams.handle;

      const profile = await agent.getProfile({ actor });

      const team = await agent.getProfiles({ actors: bskyTeam });

      const relationships = await agent.app.bsky.graph.getRelationships({
        actor: profile.data.did,
        others: team.data.profiles.map((p) => p.did),
      });

      return (
        <main className="min-h-screen grid place-items-center">
          <div className="flex flex-col gap-8 w-full max-w-sm py-8 px-2">
            <div>
              <p className="text-sm">How many Bluesky team members are following</p>
              <div className="flex items-center gap-2 mt-2 rounded border p-2 w-full">
                <img
                  src={profile.data.avatar}
                  alt={profile.data.displayName ?? "@" + profile.data.handle}
                  className="w-10 h-10 rounded-full bg-neutral-300"
                />
                <div>
                  {profile.data.displayName && (
                    <p className="font-medium">{profile.data.displayName}</p>
                  )}
                  <p className="text-neutral-400 text-xs">
                    @{profile.data.handle}
                  </p>
                </div>
              </div>
            </div>
            <ul>
              {team.data.profiles
                .sort(
                  (a, b) =>
                    ((relationships.data.relationships.find(
                      (f) => f.did === a.did
                    )?.followedBy
                      ? 1
                      : -1) -
                      (relationships.data.relationships.find(
                        (f) => f.did === b.did
                      )?.followedBy
                        ? 1
                        : -1)) *
                    -1
                )
                .filter((person) => person.did !== profile.data.did)
                .map((person) => (
                  <li key={person.did}>
                    <a
                      href={`https://bsky.app/profile/${person.did}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      {relationships.data.relationships.find(
                        (f) => f.did === person.did
                      )?.followedBy ? (
                        <CheckIcon className="text-green-500" />
                      ) : (
                        <XIcon className="text-red-500" />
                      )}
                      {person.handle}
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
