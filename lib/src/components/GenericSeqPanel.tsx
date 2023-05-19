// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import assembleBundle from "../seqpanel-api";
import { Feature } from "@jbrowse/core/util";

type Bundle = Awaited<ReturnType<typeof assembleBundle>>;

export default function GenericSeqPanel({
  nclistbaseurl,
  fastaurl,
  refseq,
  mode,
  start,
  end,
  gene,
  transcript,
  urltemplate,
}: {
  nclistbaseurl: string;
  fastaurl: string;
  refseq: string;
  mode: string;
  start: number;
  end: number;
  gene: string;
  transcript: Feature;
  urltemplate: string;
}) {
  const [result, setResult] = useState<Bundle>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        const res = await assembleBundle({
          nclistbaseurl,
          urltemplate,
          fastaurl,
          gene,
          transcript,
          refseq,
        });
        console.log({ res });
        setResult(res);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    })();
  }, [
    refseq,
    transcript,
    gene,
    start,
    end,
    fastaurl,
    urltemplate,
    nclistbaseurl,
  ]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="GenericSeqPanel">
        <SequencePanel
          mode={mode}
          sequence={result.sequence}
          feature={result.feature as any}
        />
      </div>
    );
  }
}
