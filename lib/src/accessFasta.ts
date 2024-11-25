import { RemoteFile } from "generic-filehandle";
import { BgzipIndexedFasta } from "@gmod/indexedfasta";

export async function accessFasta(
  refseq: string,
  start: number,
  end: number,
  fastaURL: string,
) {
  const fastaFilehandle = new RemoteFile(fastaURL);
  const faiFilehandle = new RemoteFile(fastaURL + ".fai");
  const gziFilehandle = new RemoteFile(fastaURL + ".gzi");

  const t = new BgzipIndexedFasta({
    fasta: fastaFilehandle,
    fai: faiFilehandle,
    gzi: gziFilehandle,
  });

  const upstreamstart = start - 499 < 0 ? 0 : start - 499;
  const downstreamend = end + 499;
  const seq = await t.getSequence(refseq, start, end);
  const upstream = await t.getSequence(refseq, upstreamstart, start);
  const downstream = await t.getSequence(refseq, end, downstreamend);

  return {
    seq: seq || "",
    upstream: upstream || "",
    downstream: downstream || "",
  };
}
