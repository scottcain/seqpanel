//@ts-nocheck

import { accessStore , accessFasta ,  assembleBundle } from ../src/seqpanel-api.ts;

describe ( "small worm gene" , () => {
	const feature = await accessStore ( props: {
	    nclistbaseurl: "https://s3.amazonaws.com/agrjbrowse/MOD-jbrowses/WormBase/WS287/c_elegans_PRJNA13758/",
	    urltemplate: "tracks/Curated_Genes/{refseq}/trackData.jsonz",
	    refseq: "I",
	    start: 43730, //purposely not quite right
	    end: 44687,
	    gene: "WBGene00022275", // txt-7
	    transcript: "Y74C9A.1.1"
	}  );

	expect(feature.length).toBe(1)
        expect(feature[0].get('start')).toBe(43733)
	expect(feature[0].get('name')).toBe('Y74C9A.1.1')
	expect(feature[0].get('subfeatures').length).toBe(14)
});

