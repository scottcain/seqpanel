import { GenericGeneSeqPanel } from "../lib/generic-sequence-panel";

function App() {
  var mode = "gene";


  return (
    <div>
      <GenericGeneSeqPanel
      refseq="X"
      start={13201770}
      end={13216729}
      gene="WBGene00006749"
      mode={mode}
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS288/c_elegans_PRJNA13758/"
      urltemplate="tracks/Curated_Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz"
      />
    </div>
  );
}

export default App;
