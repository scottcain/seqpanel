import React, { useState } from "react";
import GenericSeqPanel from "./GenericSeqPanel";
import TranscriptMenu from "./TranscriptMenu";
import { Feature } from "@jbrowse/core/util";

export default function GenericGeneSeqPanel({
  nclistbaseurl,
  fastaurl,
  refseq,
  start,
  end,
  gene,
  urltemplate,
}: {
  nclistbaseurl: string;
  fastaurl: string;
  refseq: string;
  start: number;
  end: number;
  gene: string;
  urltemplate: string;
}) {
  const [transcript, setTranscript] = useState<Feature>();
  const [mode, setMode] = useState("gene");

  return (
    <div className="GenericGeneSeqPanel">
      <div>
        <TranscriptMenu
          nclistbaseurl={nclistbaseurl}
          refseq={refseq}
          start={start}
          end={end}
          gene={gene}
          urltemplate={urltemplate}
          onChange={feature => setTranscript(feature)}
        />
        &nbsp; Mode:
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
      </div>
      {transcript ? (
        <GenericSeqPanel
          start={start}
          end={end}
          refseq={refseq}
          gene={gene}
          fastaurl={fastaurl}
          urltemplate={urltemplate}
          nclistbaseurl={nclistbaseurl}
          transcript={transcript}
          mode={mode}
        />
      ) : null}
    </div>
  );
}
