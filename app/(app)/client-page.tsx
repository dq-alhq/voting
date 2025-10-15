"use client";

import Pusher from "pusher-js";
import { useEffect, useState } from "react";

export default function ClientPage() {
  const [votes, setVotes] = useState<
    { option: string; _count: { option: number } }[]
  >([]);

  const fetchVotes = async () => {
    const res = await fetch("/api/vote");
    const data = await res.json();
    setVotes(data);
  };

  const sendVote = async (option: string) => {
    await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option }),
    });
  };

  useEffect(() => {
    fetchVotes();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("vote-channel");
    channel.bind("new-vote", () => {
      fetchVotes();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">🗳️ Realtime Voting</h1>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => sendVote("Option A")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Vote A
        </button>
        <button
          type="button"
          onClick={() => sendVote("Option B")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Vote B
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Hasil Voting:</h2>
        {votes.map((v) => (
          <div key={v.option}>
            {v.option}: <b>{v._count.option}</b>
          </div>
        ))}
      </div>
    </main>
  );
}
