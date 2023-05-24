import { GenericGeneSeqPanel } from "generic-sequence-panel";

export default function App() {
  return (
    <GenericGeneSeqPanel
      refseq="II"
      start={162374}
      end={170631}
      gene="WBGene00001340"
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS288/c_elegans_PRJNA13758/"
      urltemplate="tracks/Curated_Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/wormbase-modencode/fasta/current/c_elegans.PRJNA13758.WS284.genomic.fa.gz"
    />
  );
}
