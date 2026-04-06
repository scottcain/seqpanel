import { GenericGeneSeqPanel } from "generic-sequence-panel";

export default function App() {
  return (
    <div>
      <GenericGeneSeqPanel
        refseq="10"
        start={36950773}
        end={37075361}
        gene="myo18aa"
        nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/docker/8.2.0/zfin/zebrafish-11/"
        urltemplate="tracks/All_Genes/{refseq}/trackData.jsonz"
        fastaurl="https://s3.amazonaws.com/agrjbrowse/fasta/GCF_000002035.6_GRCz11_genomic.fna.gz"
      />
    </div>
  );
}
