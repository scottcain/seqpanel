import React, { useState, useEffect } from "react";
import SequencePanel from "@jbrowse/core/BaseFeatureWidget/SequencePanel";
import assembleBundle from "./seqpanel-api.tsx";


/*
 * Example implementation looks like
 *
 *  root.render(<SeqPanel 
 *      refseq="X"
 *      start=13201770
 *      end=13216729
 *      gene="WBGene00006749"
 *      transcript="R12H7.1a.2"
 *      mode="gene" />
 *
 */
// Create a new component that renders a div
// and calls the API to get the sequence
// and then renders the sequence

function GenericSeqPanel(props) {

  type Bundle = Awaited<ReturnType<typeof assembleBundle>>;

  const [result, setResult] = useState<Bundle>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    if (!props.nclistbaseurl) {
      throw new Error("no nclistbaseurl specified");
    } else if (!props.urltemplate) {
      throw new Error("no urltemplate specified");
    } else if (!props.fastaurl) {
      throw new Error("no fastaurl specified");
    } else if (!props.refseq) {
      throw new Error("no refseq specified");
    } else if (!props.start) {
      throw new Error("no start specified");
    } else if (!props.end) {
      throw new Error("no end specified");
    } else if (!props.gene) {
      throw new Error("no gene specified");
    } else if (!props.transcript) {
      throw new Error("no transcript specified");
    }
    (async () => {
      try {
        setResult(await assembleBundle(
		props.nclistbaseurl, 
		props.urltemplate, 
		props.fastaurl,
		props.refseq, 
		props.start, 
		props.end, 
		props.gene, 
		props.transcript));
      } catch (e) {
        setError(e);
      }
    })();
  }, []);
  if (error) {
    return <div style={{ color: "red" }}>{`${error}`}</div>;
  } else if (!result) {
    return <div>Loading...</div>;
  } else {
	  return <div className="GenericSeqPanel">
              <SequencePanel
	  	mode={props.mode}
	  	sequence={result.sequence}
	  	feature={result.feature}
	      />
	  </div>;
  }
}

export default GenericSeqPanel;
