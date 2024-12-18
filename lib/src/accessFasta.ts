import { RemoteFile } from "generic-filehandle2";
import { BgzipIndexedFasta } from "@gmod/indexedfasta";

export async function accessFasta(
  refseq: string,
  start: number,
  end: number,
  fastaURL: string,
  upDownBp: number,
) {
  const fastaFilehandle = new RemoteFile(fastaURL);
  const faiFilehandle = new RemoteFile(fastaURL + ".fai");
  const gziFilehandle = new RemoteFile(fastaURL + ".gzi");

  const t = new BgzipIndexedFasta({
    fasta: fastaFilehandle,
    fai: faiFilehandle,
    gzi: gziFilehandle,
  });

  const upstreamstart = Math.max(0, start - upDownBp);
  const downstreamend = end + upDownBp;
  const seq = await t.getSequence(refseq, start, end);
  const upstream = await t.getSequence(refseq, upstreamstart, start);
  const downstream = await t.getSequence(refseq, end, downstreamend);

  return {
    seq: seq ?? "",
    upstream: upstream ?? "",
    downstream: downstream ?? "",
  };
}
