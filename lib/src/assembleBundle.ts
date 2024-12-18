import { Feature } from "@jbrowse/core/util";
import { accessFasta } from "./accessFasta";

export async function assembleBundle({
  fastaurl,
  transcript,
  refseq,
  upDownBp,
}: {
  fastaurl: string;
  refseq: string;
  transcript: Feature;
  upDownBp: number;
}) {
  return {
    feature: transcript.toJSON(),
    sequence: await accessFasta(
      refseq,
      transcript.get("start"),
      transcript.get("end"),
      fastaurl,
      upDownBp,
    ),
  };
}
