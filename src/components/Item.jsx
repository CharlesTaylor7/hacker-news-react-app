import React, { useState, useEffect } from "react";
import * as HN from "../HackerNewsAPI";
import PollOption from "./PollOption";
import ReactLogo from "./ReactLogo";
import { SortedMap } from "immutable-sorted";

export default function Item({ item }) {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState(SortedMap([], (a, b) => b - a));
  const [pollOpts, setPollOpts] = useState([]);
  useEffect(() => {
    // if item has poll options, get all the poll options simultaneously.
    if (item.parts) {
      Promise.all(item.parts.map(HN.getItem)).then((allParts) => {
        const totalPollScore = allParts.reduce(
          (total, next) => total + next.score,
          0,
        );
        setPollOpts(
          allParts.map((pollOpt) => (
            <PollOption
              key={pollOpt.id}
              item={pollOpt}
              totalPollScore={totalPollScore}
            />
          )),
        );
      });
    }

    // if item has children, load them in one at a time.
    if (item.kids) {
      for (const childId of item.kids) {
        HN.getItem(childId).then((item) => {
          if (!item) return;
          setChildren((children) => children.set(item.id, item));
        });
      }
    }
  }, []);

  return (
    <div data-id={item.id} data-item={JSON.stringify(item)}>
      <div className="flex">
        {item.kids || item.parts ? (
          <ExpandButton open={open} setOpen={setOpen} />
        ) : (
          <ReactLogo />
        )}
        {item.url ? (
          <a
            className="underline decoration-sky-300 visited:decoration-violet-400"
            href={item.url}
            target="_blank"
            rel="no-referrer"
          >
            {item.title}
          </a>
        ) : open ? (
          <span className="whitespace-pre-wrap">{item.text}</span>
        ) : (
          <span className="truncate">{item.text}</span>
        )}
      </div>
      {open ? (
        <div className="ml-2 flex flex-col gap-1">
          {pollOpts}
          {children.toArray().map(([_, child]) => (
            <Item key={child.id} item={child} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const ExpandButton = ({ open, setOpen }) => (
  <button
    className="btn btn-primary rounded-full h-8 w-8 mx-2 min-h-revert"
    onClick={() => setOpen((status) => !status)}
  >
    {open ? "-" : "+"}
  </button>
);
