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
function GenericSeqPanel(props) {
    const [result, setResult] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        (async () => {
            try {
                setResult(await assembleBundle(props));
            }
            catch (e) {
                setError(e);
            }
        })();
    }, [props]);
    if (error) {
        return React.createElement("div", { style: { color: "red" } }, `${error}`);
    }
    else if (!result) {
        return React.createElement("div", null, "Loading...");
    }
    else {
        return (React.createElement("div", { className: "GenericSeqPanel" },
            React.createElement(SequencePanel, { mode: props.mode, sequence: result.sequence, feature: result.feature })));
    }
}
export default GenericSeqPanel;
