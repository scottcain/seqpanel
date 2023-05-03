import React, { useState, useEffect } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import assembleBundle from "../seqpanel-api";

/*
 * Example implementation looks like
 *
 *  root.render(
        <GenericSeqPanel
          refseq="X"
          start="13201770"
          end="13216729"
          gene="WBGene00006749"
          transcript="R12H7.1a.2"
          mode="protein"
          nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS287/c_elegans_PRJNA13758/"
          urltemplate="tracks/Curated_Genes/{refseq}/trackData.jsonz"
          fastaurl="https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz"
        />
    )
 *
 *
 */
// Create a new component that renders a div
// and calls the API to get the sequence
// and then renders the sequence

function GenericSeqPanel(props: {
  nclistbaseurl: string;
  fastaurl: string;
  refseq: string;
  mode: string;
  start: number;
  end: number;
  gene: string;
  transcript: string;
  urltemplate: string;
}) {
  type Bundle = Awaited<ReturnType<typeof assembleBundle>>;

  const [result, setResult] = useState<Bundle>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    (async () => {
      try {
        setResult(await assembleBundle(props));
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
    return (
      <div className="GenericSeqPanel">
        <SequencePanel
          mode={props.mode}
          sequence={result.sequence}
          feature={result.feature as any}
        />
      </div>
    );
  }
}

export default GenericSeqPanel;
