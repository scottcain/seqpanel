// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect } from "react";
import GenericSeqPanel from "./GenericSeqPanel";
import TranscriptMenu from "./TranscriptMenu";
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
  const [transcript, setTranscript] = useState<Feature>();
  //const [transcript, setTranscript] = useState();
  const [mode, setMode] = useState("gene");

  return (
      <div className="GenericGeneSeqPanel">
       <p>
         <TranscriptMenu 
	   nclistbaseurl={props.nclistbaseurl}
           refseq={props.refseq}
           start={props.start}
           end={props.end}
           gene={props.gene}
           urltemplate={props.urltemplate}
           onChange={event => setTranscript(event.target.value)} />
        &nbsp;
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
       </p> 
        {transcript ? (
          <GenericSeqPanel {...props} transcript={transcript} mode={mode} />
        ) : null}
      </div>
  );
}
