// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import transcriptList from "../fetchTranscripts";
import { Feature } from "@jbrowse/core/util";

export default function TrascriptMenu(props: {
  nclistbaseurl: string;
  refseq: string;
  start: number;
  end: number;
  gene: string;
  urltemplate: string;
}) {
  const { nclistbaseurl, refseq, start, end, gene, urltemplate } =
    props;
  const [result, setResult] = useState<Feature[]>();
  const [error, setError] = useState<unknown>();
  const [transcript, setTranscript] = useState<Feature>();

  useEffect(() => {
    (async () => {
      try {
        const res = await transcriptList({
          nclistbaseurl,
          refseq,
          start,
          end,
          gene,
          urltemplate,
        });
        setResult(res);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, [nclistbaseurl, refseq, start, end, gene, urltemplate]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="TranscriptMenu">
        Transcript:
        <select
          onChange={e =>
            setTranscript(result.find(r => r.id() === e.target.value))
          }
        >
          {result.map(r => (
            <option key={r.id()} value={r.id()}>
              {r.get("name")}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
