import { GenericGeneSeqPanel } from "generic-sequence-panel";

export default function App() {
  return (
    <div>
      <GenericGeneSeqPanel
        refseq="X"
        start={31097677}
        end={33339609}
        gene="DMD"
        nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/docker/7.0.0/human/"
        urltemplate="tracks/All_Genes/{refseq}/trackData.jsonz"
        fastaurl="https://s3.amazonaws.com/agrjbrowse/fasta/GCF_000001405.40_GRCh38.p14_genomic.fna.gz"
      />
    </div>
  );
}
