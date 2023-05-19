import { RemoteFile } from "generic-filehandle";
import NCList from "@gmod/nclist";
import { Feature } from "@jbrowse/core/util/simpleFeature";

// locals
import NCListFeature from "./NCListFeature";

// Create transcriptList function
// this function is called by the SeqPanel component
// when it needs to fetch a list of transcripts for a given gene
// it should return an array of transcript names
// (see @gmod/nclist for more info)
// it is called with five arguments:
// nclistbaseurl: the base URL of the NCList file
// urltemplate: the URL template for the NCList file
// refseq: the reference sequence (name, like "chr1")
// start: the start of the range (in interbase coordinates)
// end: the end of the range (in interbase coordinates)
// gene: the name of the gene
//
async function transcriptList(props: {
  nclistbaseurl: string;
  fastaurl: string;
  urltemplate: string;
  refseq: string;
  start: number;
  end: number;
  gene: string;
}) {
  const { nclistbaseurl, fastaurl, urltemplate, refseq, start, end, gene } =
    props;
  const store = new NCList({
    urlTemplate: urltemplate,
    baseUrl: nclistbaseurl,
    readFile: (url: string) => new RemoteFile(url).readFile(),
  });

  for await (const feature of store.getFeatures({
    refName: refseq,
    start: start,
    end: end,
  })) {
    // build a list of transcripts to return
    var transcripts;
    if (feature.get("name") === gene) {

      return  feature.get("subfeatures").forEach((value: Feature) => {
          value.get("name")} );

    }
  }
}
export default transcriptList ;
