import { RemoteFile } from "generic-filehandle";
import { BgzipIndexedFasta } from "@gmod/indexedfasta";

// locals
import NCListFeature from "./NCListFeature";
import { Feature } from "@jbrowse/core/util";

async function assembleBundle(props: {
  nclistbaseurl: string;
  urltemplate: string;
  fastaurl: string;
  refseq: string;
  gene: string;
  transcript: Feature;
}) {
  const { fastaurl, transcript, refseq } = props;
  const sequence = await accessFasta(
    refseq,
    transcript.get("start"),
    transcript.get("end"),
    fastaurl,
  );

  const f = new NCListFeature(transcript);
  return {
    feature: f.toJSON(),
    sequence,
    mode: "protein", //this will probably be overridden by the SeqPanel component
    intronBp: 10,
  };
}

// Create accessFasta function this function is called by the assembleBundle
// function
// It is called with four arguments:
//
// - refseq: the reference sequence (name, like "chr1")
// - start: the start of the range (in interbase coordinates)
// - end: the end of the range (in interbase coordinates)
// - fastaURL: the URL of the fasta file
// @return {seq:string,upstream:string,downstream:string}

async function accessFasta(
  refseq: string,
  start: number,
  end: number,
  fastaURL: string,
) {
  console.log({ start, end, refseq });
  const fastaFilehandle = new RemoteFile(fastaURL);
  const faiFilehandle = new RemoteFile(fastaURL + ".fai");
  const gziFilehandle = new RemoteFile(fastaURL + ".gzi");

  const t = new BgzipIndexedFasta({
    fasta: fastaFilehandle,
    fai: faiFilehandle,
    gzi: gziFilehandle,
    chunkSizeLimit: 500000,
  });

  const upstreamstart = start - 499;
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

export default assembleBundle;
