import { RemoteFile } from "generic-filehandle2";
import { TabixIndexedFile } from "@gmod/tabix";
import { Feature, SimpleFeature } from "@jbrowse/core/util";
import { gff3RegionToTranscripts } from "./util/gff3ToSimpleFeature";

// Fetch a list of transcripts for a given gene from a bgzip-compressed,
// tabix-indexed GFF3 file. This is called by the SeqPanel component when it
// needs to fetch a list of transcripts for a given gene, mirroring
// fetchTranscripts (the NCList equivalent).
//
// it is called with five arguments:
// - gffurl: the URL of the bgzipped, tabix-indexed GFF3 file (the ".tbi"
//   index is assumed to live alongside it)
// - refseq: the reference sequence (name, like "chr1")
// - start: the start of the range (in interbase coordinates)
// - end: the end of the range (in interbase coordinates)
// - gene: the name of the gene
export default async function fetchTranscriptsTabix({
  gffurl,
  refseq,
  start,
  end,
  gene,
}: {
  gffurl: string;
  refseq: string;
  start: number;
  end: number;
  gene: string;
}): Promise<Feature[]> {
  const tabixFile = new TabixIndexedFile({
    filehandle: new RemoteFile(gffurl),
    tbiFilehandle: new RemoteFile(`${gffurl}.tbi`),
  });

  const lines: string[] = [];
  await tabixFile.getLines(refseq, start, end, line => {
    lines.push(line);
  });

  const transcripts = gff3RegionToTranscripts(lines.join("\n"), gene);
  return transcripts.map(t => new SimpleFeature(t));
}
