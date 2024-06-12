import { GenericGeneSeqPanel, fetchTranscripts } from "generic-sequence-panel";
import { useEffect, useState } from "react";

export default function App() {
  const [result, setResult] = useState<unknown>();
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchTranscripts({
          nclistbaseurl:
            "https://s3.amazonaws.com/agrjbrowse/docker/7.0.0/human/",
          fastaurl:
            "https://s3.amazonaws.com/agrjbrowse/fasta/sarscov2.fasta.gz",
          refseq: "X",
          start: 31097677,
          end: 33339609,
          gene: "DMD",
          urltemplate: "tracks/All_Genes/{refseq}/trackData.jsonz",
        });
        console.log(res);
        setResult(res);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      {!result ? (
        <div>Loading example of the fetchTranscripts function...</div>
      ) : (
        <div>
          Got result from fetchTranscripts:{" "}
          {JSON.stringify(result).slice(0, 100)} etc. etc...
        </div>
      )}
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
    </div>
  );
}
