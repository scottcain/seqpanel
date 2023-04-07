import React from "react";
import GenericSeqPanel from "./GenericSeqPanel";

// const queryParameters = new URLSearchParams(window.location.search);
// const nclistbaseurl =
//   "https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS287/c_elegans_PRJNA13758/";
// const urltemplate = "tracks/Curated_Genes/{refseq}/trackData.jsonz";
// const fastaurl =
//   "https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz";
// const refseq = queryParameters.get("refseq");
// const start = queryParameters.get("start");
// const end = queryParameters.get("end");
// const gene = queryParameters.get("gene");
// const transcript = queryParameters.get("transcript");
// const mode = queryParameters.get("mode");

export default function App() {
  return (
    <GenericSeqPanel
      refseq="X"
      start={13201770}
      end={13216729}
      gene="WBGene00006749"
      transcript="R12H7.1a.2"
      mode="protein"
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS287/c_elegans_PRJNA13758/"
      urltemplate="tracks/Curated_Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz"
    />
  );
}
