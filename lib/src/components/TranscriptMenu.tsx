import React, { useState, useEffect } from "react";
import transcriptList from "../fetchTranscripts";
import { Feature } from "@jbrowse/core/util";

export default function TrascriptMenu({
  nclistbaseurl,
  refseq,
  start,
  end,
  gene,
  urltemplate,
  onChange,
}: {
  nclistbaseurl: string;
  refseq: string;
  start: number;
  end: number;
  gene: string;
  urltemplate: string;
  onChange: (arg: Feature) => void;
}) {
  const [error, setError] = useState<unknown>();
  const [transcript, setTranscript] = useState<Feature>();
  const [transcriptArray, setTranscriptArray] = useState<Feature[]>();

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
        setTranscriptArray(res);
        setTranscript(res[0]); //set the initial selection to the first item in the list
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, [nclistbaseurl, refseq, start, end, gene, urltemplate]);

  useEffect(() => {
    if (transcript) {
      onChange(transcript);
    }
  }, [transcript, onChange]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!transcriptArray) {
    return <div>Loading...</div>;
  } else {
    return transcript && transcriptArray ? (
      <TranscriptMenu2
        value={transcript.id()}
        options={transcriptArray}
        onChange={str => transcriptArray.find(t => t.id() === str)}
      />
    ) : null;
  }
}

function TranscriptMenu2({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Feature[];
  onChange: (arg: string) => void;
}) {
  return (
    <div>
      Transcript:
      <select value={value} onChange={event => onChange(event.target.value)}>
        {options.map(o => (
          <option key={o.id()} value={o.id()}>
            {o.get("name")}
          </option>
        ))}
      </select>
    </div>
  );
}
