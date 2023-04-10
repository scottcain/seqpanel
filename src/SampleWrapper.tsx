import React, {useState} from "react";
import GenericSeqPanel from "./GenericSeqPanel";

export default function SampleWrapper() {
    const [mode, setMode] = useState('gene');

    function handleModeChange(mode) {
	setMode(mode);
    }
    return(
    <>
    <select onChange={(e) => handleModeChange(e.target.value)}>
        <option value='gene'>gene</option>
        <option value='protein'>protein</option>
        <option value='cdna'>cdna</option>
        <option value='gene_updownstream_collapsed_intron'>gene with collapsed introns</option>
    </select>
    <br />
    <GenericSeqPanel
      refseq="X"
      start={13201770}
      end={13216729}
      gene="WBGene00006749"
      transcript="R12H7.1a.2"
      mode={mode}
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS287/c_elegans_PRJNA13758/"
      urltemplate="tracks/Curated_Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz"
    />
    </>
    )
}
