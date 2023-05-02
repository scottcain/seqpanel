import React from "react";
import ReactDOM from "react-dom";
import GenericSeqPanel from "./components/GenericSeqPanel";
ReactDOM.render(React.createElement(React.StrictMode, null,
    React.createElement(GenericSeqPanel, { refseq: "X", start: 13201770, end: 13216729, gene: "WBGene00006749", transcript: "R12H7.1a.2", mode: "protein", nclistbaseurl: "https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS287/c_elegans_PRJNA13758/", urltemplate: "tracks/Curated_Genes/{refseq}/trackData.jsonz", fastaurl: "https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz" })), document.getElementById("root"));
