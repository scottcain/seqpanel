// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import GenericSeqPanel from "./GenericSeqPanel";
import transcriptList from "../fetchTranscripts";
import { Feature } from "@jbrowse/core/util";

export default function GenericGeneSeqPanel(props: {
  nclistbaseurl: string;
  fastaurl: string;
  refseq: string;
  start: number;
  end: number;
  gene: string;
  urltemplate: string;
}) {
  const { nclistbaseurl, fastaurl, refseq, start, end, gene, urltemplate } =
    props;
  const [result, setResult] = useState<Feature[]>();
  const [error, setError] = useState<unknown>();
  const [transcript, setTranscript] = useState<Feature>();
  const [mode, setMode] = useState("gene");
  const feature = transcript || result?.[0];
  useEffect(() => {
    (async () => {
      try {
        const res = await transcriptList({
          nclistbaseurl,
          fastaurl,
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
  }, [nclistbaseurl, fastaurl, refseq, start, end, gene, urltemplate]);

  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="GenericGeneSeqPanel">
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
        Mode:
        <select onChange={e => setMode(e.target.value)}>
          <option value="gene">gene</option>
          <option value="cds">CDS</option>
          <option value="cdna">cDNA</option>
          <option value="protein">protein</option>
          <option value="genomic">genomic</option>
          <option value="genomic_sequence_updown">
            genomic +500bp up and down stream
          </option>
          <option value="gene_collapsed_intron">
            gene with collapsed introns
          </option>
          <option value="gene_updownstream">
            gene with 500bp up and down stream
          </option>
          <option value="gene_updownstream_collapsed_intron">
            gene with 500bp up and down stream and collapsed introns
          </option>
        </select>
        <br />
        {feature ? (
          <GenericSeqPanel {...props} transcript={feature} mode={mode} />
        ) : null}
      </div>
    );
  }
}
