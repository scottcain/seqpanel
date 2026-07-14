import { useEffect, useState } from "react";
import { GenericGeneSeqPanel, fetchTranscripts } from "generic-sequence-panel";

export default function App() {
  const [viralError, setViralError] = useState<unknown>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        await fetchTranscripts({
          nclistbaseurl:
            "https://s3.amazonaws.com/agrjbrowse/docker/3.2.0/SARS-CoV-2/",
          refseq: "NC_045512.2",
          start: 8555,
          end: 10054,
          gene: "nsp4",
          urltemplate: "tracks/All Genes/{refseq}/trackData.jsonz",
        });
      } catch (e) {
        setViralError(e);
      }
    })();
  }, []);

  return (
    <div>
      <h3>Viral sequence (expected error)</h3>
      {viralError ? (
        <div style={{ color: "red" }}>{`${viralError}`}</div>
      ) : (
        <div>Loading...</div>
      )}

      <h3>DMD (a very long human gene, ~2.2Mb)</h3>
      <GenericGeneSeqPanel
        refseq="X"
        start={31097677}
        end={33339609}
        gene="DMD"
        gffurl="https://s3.amazonaws.com/agrjbrowse/docker/9.1.0/human/GFF_HUMAN.sorted.gff.gz"
        fastaurl="https://s3.amazonaws.com/agrjbrowse/fasta/GCF_000001405.40_GRCh38.p14_genomic.fna.gz"
      />
    </div>
  );
}
