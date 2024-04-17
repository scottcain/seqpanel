import { GenericGeneSeqPanel, TranscriptMenu } from "generic-sequence-panel";

export default function App() {
  return (
   <div>
    <GenericGeneSeqPanel
      refseq="NC_045512.2"
      start={8555}
      end={10054}
      gene="nsp4"
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/docker/3.2.0/SARS-CoV-2/"
      urltemplate="tracks/All Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/agrjbrowse/fasta/sarscov2.fasta.gz"
    />
    <GenericGeneSeqPanel
      refseq="X"
      start={31097677}
      end={33339609}
      gene="DMD"
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/docker/7.0.0/human/"
      urltemplate="tracks/All_Genes/{refseq}/trackData.jsonz"
      fastaurl="https://s3.amazonaws.com/agrjbrowse/fasta/GCF_000001405.40_GRCh38.p14_genomic.fna.gz"
    />
    <p>just the menu?</p>
    <TranscriptMenu
      refseq="X"
      start={31097677}
      end={33339609}
      gene="DMD"
      nclistbaseurl="https://s3.amazonaws.com/agrjbrowse/docker/7.0.0/human/"
      urltemplate="tracks/All_Genes/{refseq}/trackData.jsonz"
    />
   </div>
  );
}
