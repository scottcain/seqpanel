import React, { useState, useEffect } from "react";
import GenericSeqPanel from "./GenericSeqPanel";
import transcriptList from "../genepanel-api";

type UpdateSeqProps = {
  props: {
    nclistbaseurl: string;
    fastaurl: string;
    refseq: string;
    start: number;
    end: number;
    gene: string;
    urltemplate: string;
  };
  trans: string;
  mod: string;
};

function UpdateSeq({ props, trans, mod }: UpdateSeqProps) {
  useEffect(() => {}, [trans, mod]);

  return (
    <GenericSeqPanel
      refseq={props.refseq}
      start={props.start}
      end={props.end}
      gene={props.gene}
      transcript={trans}
      mode={mod}
      nclistbaseurl={props.nclistbaseurl}
      urltemplate={props.urltemplate}
      fastaurl={props.fastaurl}
    />
  );
}

function GenericGeneSeqPanel(props: {
  nclistbaseurl: string;
  fastaurl: string;
  refseq: string;
  start: number;
  end: number;
  gene: string;
  urltemplate: string;
}) {
  const [result, setResult] = useState(); //the result should be a list of transcript names
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        setResult(await transcriptList(props));
      } catch (e) {
        setError(e);
      }
    })();
  }, [props]);
  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
    const [valueTranscript, setValueTranscript] = useState("");
    const [valueMode, setValueMode] = useState("gene");

    return (
      <div className="GenericGeneSeqPanel">
        Transcript:
        <select
          onChange={e => {
            setValueTranscript(e.target.value);
          }}
        >
          console.log(result)
        </select>
        Mode:
        <select
          onChange={e => {
            setValueMode(e.target.value);
          }}
        >
          <option value="gene">gene</option>
          <option value="cds">CDS</option>
          <option value="cdna">cDNA</option>
          <option value="protein">protein</option>
          <option value="genomic">genomic</option>
          <option value="genomic_sequence_updown">
            genomic +500bp up and down stream
          </option>
          <option value="gene_collapsed_intron">
            gene with colapsed introns
          </option>
          <option value="gene_updownstream">
            gene with 500bp up and down stream
          </option>
          <option value="gene_updownstream_collapsed_intron">
            gene with 500bp up and down stream and colapsed introns
          </option>
        </select>
        <br />
        <UpdateSeq props={props} trans={valueTranscript} mod={valueMode} />
      </div>
    );
  }
}

export default GenericGeneSeqPanel;
