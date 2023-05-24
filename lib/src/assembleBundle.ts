import { Feature } from "@jbrowse/core/util";
import NCListFeature from "./NCListFeature";
import { accessFasta } from "./accessFasta";

export async function assembleBundle(props: {
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
