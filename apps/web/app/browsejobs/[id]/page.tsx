import React from "react";

// Next 16 — params is a Promise, so it must be awaited
const JobDetailspage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  console.log("id", id);
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 text-sm text-gray-400 sm:px-6">
      Job Details — <span className="font-mono text-white">{id}</span>
    </div>
  );
};

export default JobDetailspage;
