import { GenericGeneSeqPanel } from "generic-sequence-panel";

export default function App() {
  return (
    <GenericGeneSeqPanel
      refseq="16"
      start={5239721}
      end={7713340}
      gene="RBFOX1"
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/docker/6.0.0/human/"
      urltemplate="tracks/All_Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/agrjbrowse/fasta/GCF_000001405.40_GRCh38.p14_genomic.fna.gz"
    />
  );
}
