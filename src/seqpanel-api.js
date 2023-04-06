import { RemoteFile } from "generic-filehandle";
import NCList from "@gmod/nclist";
import NCListFeature from "./NCListFeature.ts";
import { BgzipIndexedFasta } from "@gmod/indexedfasta";

//create functions that fetch annotations from the server
//and return them in a format that can be used by the
//SeqPanel object

//this function is called by the SeqPanel component 
//when it needs to fetch annotations and sequence for a given range 
//it should return an object consisting of the following properties:
//feature: a feature object
//sequence: a sequence object (that has sequence for the range plus
//	  some extra sequence on either side)	
//	  (see @gmod/indexedfasta for more info)
//	  (see @gmod/nclist for more info)
//mode: a string that is one of:
//   genomic
//   genomic_sequence_updown
//   cds
//   cdna
//   protein
//   gene
//   gene_collapsed_intron
//   gene_updownstream
//   gene_updownstream_collapsed_intron
//   (though this will probably be overridden by the SeqPanel component)
//intronBp: the number of base pairs to show for truncated introns

async function assembleBundle(
		nclistbaseurl: string, 
		urltemplate: string, 
                fastaurl: string,
		refseq: string, 
		start: number,
		end: number,
		gene: string, 
		transcript: string
) {
    const feature = await accessStore(nclistbaseurl, urltemplate, refseq, start, end, gene, transcript);
    const sequence = await accessFasta(refseq, feature[1], feature[2], fastaurl);

    const f = new NCListFeature(feature);
    return {
      feature: f.toJSON(),
      sequence,
      mode: "protein", //this will probably be overridden by the SeqPanel component 
      intronBp: 10,
    };
}   	
export default assembleBundle;

//Create accessFasta function
//this function is called by the assembleBundle function
//It is called with four arguments:
//refseq: the reference sequence (name, like "chr1")
//start: the start of the range (in interbase coordinates)
//end: the end of the range (in interbase coordinates)
//fastaURL: the URL of the fasta file
//it should return a sequence object consisting of:
//seq: the sequence for the range
//upstream: the sequence upstream of the range
//downstream: the sequence downstream of the range

async function accessFasta(
			refseq: string,
			start: number,
			end: number,
			fastaURL: string) {
	const fastaFilehandle = new RemoteFile(fastaURL);
	const faiFilehandle = new RemoteFile(fastaURL + ".fai");
	const gziFilehandle = new RemoteFile(fastaURL + ".gzi");

	const t = new BgzipIndexedFasta({
		fasta: fastaFilehandle,
		fai: faiFilehandle,
		gzi: gziFilehandle,
		chunkSizeLimit: 500000
	});

        const upstreamstart = start - 499;
	const downstreamend = end + 499;
	const seq = await t.getSequence({ refseq, start, end });
	const upstream = await t.getSequence({ refseq, upstreamstart, start });
	const downstream = await t.getSequence({ refseq, end, downstreamend});

	return {
		seq: seq || "",
		upstream: upstream || "",
		downstream: downstream || "",
	};
}

//Create accessStore function
//this function is called by the assembleBundle function
//It is called with seven arguments:
//nclistbaseurl: the base URL of the NCList file
//urltemplate: the URL template for the NCList file
//refseq: the reference sequence (name, like "chr1")
//start: the start of the range (in interbase coordinates)
//end: the end of the range (in interbase coordinates)
//gene: the name of the gene
//transcript: the name of the transcript
//it should return a single transcript feature object

async function accessStore(
			nclistbaseurl: string,
			urltemplate: string,
			refseq: string,
			start: number,
			end: number,
			gene: string,
			transcript: string) {
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
		//keep only the transcript we're looking for
		if (feature.get("name") === gene) {
			return feature.get("subfeatures")
			.find((value: any) => value.get("name") === transcript);
		}
	}
}

