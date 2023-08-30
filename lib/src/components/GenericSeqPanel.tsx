// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import { assembleBundle } from "../assembleBundle";
import { Feature } from "@jbrowse/core/util";
import copy from 'copy-to-clipboard'
import { Button } from 'reactstrap';

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
        setResult(res);
//	console.log(res.sequence.seq);
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
     <>
      <div className="GenericSeqPanel">
        <SequencePanel
          mode={mode}
          sequence={result.sequence}
          feature={result.feature as any}
        />
      </div>
        <ul>
          <li><span style={{ background: 'rgb(250, 200, 200)' }}>Up/downstream</span></li>
          <li><span style={{ background: 'rgb(200, 240, 240)' }}>UTR</span></li>
          <li><span style={{ background: 'rgb(220, 220, 180)' }}>Coding</span></li>
          <li>Intron</li>
          <li><span style={{ background: 'rgb(200, 255, 200)' }}>Genomic (i.e., unprocessed)</span></li>
          <li><span style={{ background: 'rgb(220, 160, 220)' }}>Amino acid</span></li>
        </ul>
        <p>Note that lowercase bases generally indicate masked sequence.</p>
     </>
    );
  }
}
